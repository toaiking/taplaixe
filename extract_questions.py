import json
import re
from pathlib import Path
import pymupdf
from PIL import Image

PDF_PATH = "600-câu-thi-lý-thuyết-ô-tô-2025.pdf"
OUTPUT_JSON = "questions.json"
IMAGES_DIR = Path("public/images")

# Danh sách 60 câu hỏi điểm liệt theo bộ 600 câu hỏi 2025 của Cục CSGT (Bộ Công an)
CRITICAL_QUESTION_IDS = {
    19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
    30, 32, 34, 35,
    47, 48,
    52, 53, 55, 58,
    63, 64, 65, 66, 67, 68,
    70, 71, 72, 73, 74,
    85, 86, 87, 88, 89, 90, 91, 92, 93,
    97, 98,
    102,
    117,
    163, 165, 167,
    197, 198,
    206,
    215,
    226,
    234,
    245, 246,
    252, 253, 254, 255,
    260,
}

CHAPTER_RANGES = [
    (1, 1, 180),
    (2, 181, 205),
    (3, 206, 263),
    (4, 264, 300),
    (5, 301, 485),
    (6, 486, 600),
]

STOP_PHRASES = [
    "trong các trường hợp dưới đây",
    "như thế nào là đúng quy tắc giao thông",
    "như thế nào là đúng",
    "như hình vẽ dưới đây",
    "dưới đây",
    "là gì",
    "những điểm gì",
    "như thế nào",
    "được hiểu như thế nào",
    "phải làm gì",
    "có được phép",
    "hay không",
    "trên đường bộ",
    "người lái xe",
    "người điều khiển",
    "tham gia giao thông",
]


def get_chapter(q_id: int) -> int:
    for chap, start, end in CHAPTER_RANGES:
        if start <= q_id <= end:
            return chap
    return 0


def update_critical_questions(questions: list[dict]) -> list[dict]:
    """Cập nhật trường isCritical = True cho danh sách 60 câu hỏi điểm liệt."""
    for q in questions:
        q["isCritical"] = q["id"] in CRITICAL_QUESTION_IDS
    return questions


def extract_keywords(question_text: str) -> list[str]:
    """Trích xuất một số từ khóa ngắn gọn từ nội dung câu hỏi."""
    text = question_text.lower()
    text = re.sub(r"[?!.,:;\"'()]", " ", text)
    for phrase in STOP_PHRASES:
        text = text.replace(phrase, " ")
    words = [w for w in text.split() if len(w) > 1]
    if not words:
        return []
    keywords = []
    chunk_size = 3
    for i in range(0, min(len(words), 9), chunk_size):
        kw = " ".join(words[i : i + chunk_size]).strip()
        if kw and kw not in keywords:
            keywords.append(kw)
    return keywords[:3]


def is_dark_color(color) -> bool:
    if color is None:
        return False
    if isinstance(color, (int, float)):
        return color < 0.5
    if isinstance(color, (tuple, list)) and len(color) >= 3:
        return max(color[:3]) < 0.5
    return False


def get_page_underlines(page: pymupdf.Page) -> list[tuple[float, float, float, float]]:
    """Tìm các đường gạch chân (vector rect/line màu tối, mỏng, nằm ngang)."""
    underlines = []
    for d in page.get_drawings():
        r = d["rect"]
        w = r.x1 - r.x0
        h = r.y1 - r.y0
        if h <= 3.5 and w >= 8.0:
            if is_dark_color(d.get("fill")) or is_dark_color(d.get("color")):
                underlines.append((r.x0, r.y0, r.x1, r.y1))
    return underlines


def box_is_underlined(
    bbox: tuple[float, float, float, float],
    underlines: list[tuple[float, float, float, float]],
) -> bool:
    lx0, ly0, lx1, ly1 = bbox
    mid_y = ly0 + 0.55 * (ly1 - ly0)
    for ux0, uy0, ux1, uy1 in underlines:
        if mid_y <= uy0 <= ly1 + 4.5:
            overlap_x = min(lx1, ux1) - max(lx0, ux0)
            if overlap_x >= 5.0:
                return True
    return False


def is_chapter_header(text: str, is_bold: bool, x0: float) -> bool:
    if re.match(r"^CHƯƠNG\s+[IVX]+\b", text):
        return True
    if is_bold and x0 > 110 and text.isupper() and len(text) > 5:
        return True
    return False


def is_page_number(text: str, bbox: tuple[float, float, float, float]) -> bool:
    return bbox[1] < 55 and text.isdigit() and bbox[0] > 200


def split_line_options(line: dict, underlines: list[tuple[float, float, float, float]]) -> list[dict] | None:
    """
    Nếu một dòng chứa 1 hoặc nhiều lựa chọn (vd '1. Biển 1.     3. Biển 1 và biển 3.'),
    dùng raw_text (giữ nguyên khoảng trắng nhiều dấu cách) để tách chính xác từng lựa chọn.
    """
    raw_text = "".join(s["text"] for s in line["spans"]).strip()
    if not raw_text:
        return None

    matches = list(re.finditer(r"(?:^|\s{2,})([1-4])\.\s+", raw_text))
    if not matches or matches[0].start() != 0:
        return None

    if len(matches) == 1:
        opt_num = int(matches[0].group(1))
        opt_text = re.sub(r"\s+", " ", raw_text[matches[0].end():]).strip()
        return [
            {
                "num": opt_num,
                "text": opt_text,
                "bbox": line["bbox"],
                "underlined": box_is_underlined(line["bbox"], underlines),
            }
        ]

    lx0, ly0, lx1, ly1 = line["bbox"]
    total_len = max(1, len(raw_text))
    segments = []
    for idx, m in enumerate(matches):
        start_c = m.start()
        end_c = matches[idx + 1].start() if idx + 1 < len(matches) else len(raw_text)
        sx0 = lx0 + (lx1 - lx0) * (start_c / total_len)
        sx1 = lx0 + (lx1 - lx0) * (end_c / total_len)
        seg_box = (sx0, ly0, sx1, ly1)
        opt_text = re.sub(r"\s+", " ", raw_text[m.end():end_c]).strip()
        segments.append(
            {
                "num": int(m.group(1)),
                "text": opt_text,
                "bbox": seg_box,
                "underlined": box_is_underlined(seg_box, underlines),
            }
        )
    return segments


def parse_pdf(pdf_path: str) -> list[dict]:
    doc = pymupdf.open(pdf_path)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    questions: list[dict] = []
    current_q: dict | None = None
    in_chapter_header = False

    def finalize_question(q: dict | None):
        if q is None:
            return
        q_text = re.sub(r"\s+", " ", " ".join(q["question_lines"])).strip()
        # Sắp xếp options theo số thứ tự 1, 2, 3, 4
        sorted_opts = [q["options"][k] for k in sorted(q["options"].keys())]
        options_text = [
            re.sub(r"\s+", " ", " ".join(opt["lines"])).strip()
            for opt in sorted_opts
        ]
        correct_idx = -1
        for idx, opt in enumerate(sorted_opts):
            if opt["underlined"]:
                correct_idx = idx
                break

        image_path = None
        if q["images"]:
            img_page_idx = q["images"][0]["page"]
            page = doc[img_page_idx]
            same_page_imgs = [im["rect"] for im in q["images"] if im["page"] == img_page_idx]
            same_page_caps = [c["bbox"] for c in q["caption_boxes"] if c["page"] == img_page_idx]
            all_boxes = same_page_imgs + same_page_caps

            min_x = min(b[0] for b in all_boxes)
            max_x = max(b[2] for b in all_boxes)
            min_y = min(b[1] for b in all_boxes)
            max_y = max(b[3] for b in all_boxes)

            if q["q_end_page"] == img_page_idx:
                y_top = max(0.0, q["q_end_y"] + 1.0)
            else:
                y_top = max(40.0, min_y - 4.0)

            # Chỉ giới hạn y_bottom theo đáp án 1 nếu đáp án 1 nằm bên dưới ảnh (không nằm cạnh phải)
            opt1_below = (
                q["opt1_start_page"] == img_page_idx
                and q["opt1_start_y"] is not None
                and q["opt1_start_y"] >= max_y - 2.0
            )
            if opt1_below:
                y_bottom = min(page.rect.height, q["opt1_start_y"] - 1.0)
            else:
                y_bottom = min(page.rect.height - 20.0, max_y + 4.0)

            if y_bottom <= min_y:
                y_bottom = min(page.rect.height, max_y + 4.0)
            if y_top >= max_y:
                y_top = max(0.0, min_y - 4.0)

            x0 = max(0.0, min_x - 6.0)
            x1 = min(page.rect.width, max_x + 6.0)
            clip_rect = pymupdf.Rect(x0, y_top, x1, y_bottom)

            pix = page.get_pixmap(clip=clip_rect, dpi=200)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            out_file = IMAGES_DIR / f"cau_{q['id']}.webp"
            img.save(out_file, "WEBP", quality=88)
            image_path = f"/images/cau_{q['id']}.webp"

        questions.append(
            {
                "id": q["id"],
                "chapter": get_chapter(q["id"]),
                "isCritical": False,
                "question": q_text,
                "image": image_path,
                "options": options_text,
                "correctAnswer": correct_idx,
                "explanation": "",
                "keywords": extract_keywords(q_text),
            }
        )

    for page_idx in range(3, len(doc)):
        page = doc[page_idx]
        underlines = get_page_underlines(page)

        page_images = []
        seen_rects = set()
        for img_info in page.get_images(full=True):
            xref = img_info[0]
            for r in page.get_image_rects(xref):
                key = (round(r.x0, 1), round(r.y0, 1), round(r.x1, 1), round(r.y1, 1))
                if key not in seen_rects:
                    seen_rects.add(key)
                    page_images.append((r.x0, r.y0, r.x1, r.y1))

        text_dict = page.get_text("dict")
        events = []
        for b in text_dict["blocks"]:
            if b["type"] != 0:
                continue
            for l in b["lines"]:
                raw_text = "".join(s["text"] for s in l["spans"])
                text = re.sub(r"\s+", " ", raw_text).strip()
                if not text:
                    continue
                bbox = tuple(l["bbox"])
                if is_page_number(text, bbox):
                    continue
                first_span = next((s for s in l["spans"] if s["text"].strip()), l["spans"][0])
                is_bold = bool(first_span["flags"] & 16) or ("Bold" in first_span["font"])
                events.append(
                    {
                        "type": "line",
                        "y0": bbox[1],
                        "x0": bbox[0],
                        "bbox": bbox,
                        "text": text,
                        "spans": l["spans"],
                        "is_bold": is_bold,
                        "has_ul": box_is_underlined(bbox, underlines),
                    }
                )

        for r in page_images:
            events.append({"type": "image", "y0": r[1], "x0": r[0], "bbox": r})

        events.sort(key=lambda e: (round(e["y0"], 1), round(e["x0"], 1)))

        for ev in events:
            if ev["type"] == "image":
                if current_q is not None:
                    current_q["images"].append({"page": page_idx, "rect": ev["bbox"]})
                continue

            text = ev["text"]
            bbox = ev["bbox"]
            is_bold = ev["is_bold"]

            if is_chapter_header(text, is_bold, bbox[0]):
                in_chapter_header = True
                continue

            q_match = re.match(r"^Câu\s+(\d+)[.:]\s*(.*)$", text)
            if q_match and (is_bold or bbox[0] < 100):
                in_chapter_header = False
                finalize_question(current_q)
                q_id = int(q_match.group(1))
                q_rest = q_match.group(2).strip()
                current_q = {
                    "id": q_id,
                    "question_lines": [q_rest] if q_rest else [],
                    "q_end_page": page_idx,
                    "q_end_y": bbox[3],
                    "opt1_start_page": None,
                    "opt1_start_y": None,
                    "images": [],
                    "caption_boxes": [],
                    "options": {},
                    "last_opt_num": None,
                }
                continue

            if in_chapter_header or current_q is None:
                continue

            if not is_bold:
                opt_segments = split_line_options(ev, underlines)
                if opt_segments:
                    for seg in opt_segments:
                        opt_num = seg["num"]
                        if opt_num == 1 and current_q["opt1_start_y"] is None:
                            current_q["opt1_start_page"] = page_idx
                            current_q["opt1_start_y"] = seg["bbox"][1]
                        if opt_num not in current_q["options"]:
                            current_q["options"][opt_num] = {
                                "lines": [seg["text"]] if seg["text"] else [],
                                "underlined": seg["underlined"],
                            }
                        else:
                            if seg["text"]:
                                current_q["options"][opt_num]["lines"].append(seg["text"])
                            current_q["options"][opt_num]["underlined"] = (
                                current_q["options"][opt_num]["underlined"] or seg["underlined"]
                            )
                        current_q["last_opt_num"] = opt_num
                    continue

            if not current_q["options"]:
                if current_q["images"]:
                    current_q["caption_boxes"].append({"page": page_idx, "bbox": bbox})
                else:
                    current_q["question_lines"].append(text)
                    current_q["q_end_page"] = page_idx
                    current_q["q_end_y"] = bbox[3]
            else:
                last_num = current_q["last_opt_num"]
                current_q["options"][last_num]["lines"].append(text)
                if ev["has_ul"]:
                    current_q["options"][last_num]["underlined"] = True

    finalize_question(current_q)
    return questions


def main():
    questions = parse_pdf(PDF_PATH)
    questions = update_critical_questions(questions)

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    total = len(questions)
    with_img = sum(1 for q in questions if q["image"])
    critical_cnt = sum(1 for q in questions if q["isCritical"])
    missing_ans = [q["id"] for q in questions if q["correctAnswer"] == -1]
    bad_opts = [q["id"] for q in questions if len(q["options"]) < 2]

    print(f"Extracted {total} questions -> {OUTPUT_JSON}")
    print(f"Images saved: {with_img} -> {IMAGES_DIR}/")
    print(f"Critical questions (diem liet): {critical_cnt}")
    print(f"Missing correctAnswer: {len(missing_ans)} {missing_ans[:20]}")
    print(f"Questions with < 2 options: {len(bad_opts)} {bad_opts[:20]}")


if __name__ == "__main__":
    main()

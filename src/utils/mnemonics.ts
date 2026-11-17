import { Question } from '../types/question';

export const DECISIVE_KEYWORDS = [
  'bị nghiêm cấm',
  'nghiêm cấm',
  'không được phép',
  'không được',
  'phải dừng lại',
  'dừng lại',
  'giảm tốc độ',
  'đi sát về bên phải',
  'nhường đường',
  'cơ quan có thẩm quyền',
  'cả hai ý trên',
  'cả ba ý trên',
  'tất cả các hướng',
  'xe chữa cháy',
  'xe ưu tiên',
  'tín hiệu đèn',
  'vạch kẻ đường',
  'nồng độ cồn',
  'tốc độ tối đa',
  'khoảng cách an toàn',
  'chỉ được',
  'bắt buộc',
  'người đi bộ',
  'xe lăn của người khuyết tật',
  'đường sắt',
  'cảnh sát giao thông',
];

export function buildHighlightRegex(extraKeywords: string[] = []): RegExp {
  const combined = [...DECISIVE_KEYWORDS, ...extraKeywords]
    .map((k) => k.trim())
    .filter((k) => k.length >= 3);
  const unique = Array.from(new Set(combined)).sort((a, b) => b.length - a.length);
  const escaped = unique.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`(${escaped.join('|')})`, 'gi');
}

function shortText(s: string, maxLen = 85): string {
  const clean = s.trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen).trim()}...`;
}

export function getQuestionExplanation(q: Question): {
  quickTip: string;
  legalBasis: string;
} {
  if (q.explanation && q.explanation.trim()) {
    return {
      quickTip: 'Ghi nhớ quy tắc chuẩn của Cục CSGT 2026.',
      legalBasis: q.explanation,
    };
  }

  const text = q.question.toLowerCase();
  const ans = q.options[q.correctAnswer] || '';
  const ansLower = ans.toLowerCase();

  // 1. Hiệu lệnh Cảnh sát giao thông (Câu 36, 37...)
  if (text.includes('cảnh sát giao thông')) {
    if (ansLower.includes('phía trước và phía sau')) {
      return {
        quickTip: 'CSGT dang ngang 2 tay: Trước & Sau dừng lại; Phải & Trái đi tất cả các hướng.',
        legalBasis:
          'Hiệu lệnh của người điều khiển giao thông có hiệu lực cao nhất, bắt buộc chấp hành trước đèn tín hiệu và biển báo.',
      };
    }
    if (ansLower.includes('tất cả các hướng phải dừng lại')) {
      return {
        quickTip: 'CSGT giơ tay thẳng đứng: Tất cả các hướng dừng lại (trừ xe đã ở trong giao lộ).',
        legalBasis:
          'Khi người điều khiển giao thông giơ tay thẳng đứng báo hiệu tất cả phương tiện phải dừng lại trước giao lộ để giải tỏa khu vực giao nhau.',
      };
    }
  }

  // 2. Nồng độ cồn
  if (text.includes('nồng độ cồn')) {
    return {
      quickTip: 'Lái xe khi có nồng độ cồn = Bị nghiêm cấm tuyệt đối (mức 0).',
      legalBasis:
        'Luật TTATGTĐB nghiêm cấm điều khiển phương tiện tham gia giao thông khi trong máu hoặc hơi thở có nồng độ cồn.',
    };
  }

  // 3. Đường sắt / Rào chắn
  if (text.includes('đường sắt') || text.includes('rào chắn')) {
    return {
      quickTip: 'Gặp báo hiệu đường sắt / rào chắn → Dừng lại bên phải trước vạch dừng an toàn.',
      legalBasis:
        'Phương tiện đường sắt luôn được ưu tiên tuyệt đối tại đường ngang; mọi xe cơ giới phải dừng lại nhường đường khi có chuông, đèn đỏ hoặc rào chắn.',
    };
  }

  // 4. Tốc độ & Khoảng cách
  if (text.includes('tốc độ')) {
    return {
      quickTip: 'Trong KĐDC: Đường đôi 60 km/h, Đường 2 chiều 50 km/h (Ngoài KĐDC giảm dần 90/80 → 60/50).',
      legalBasis: `Đáp án đúng: "${shortText(ans)}" theo quy định tốc độ tối đa cho từng loại xe và loại đường.`,
    };
  }

  if (text.includes('khoảng cách')) {
    return {
      quickTip: '60 km/h → 35m • 60–80 km/h → 55m • 80–100 km/h → 70m • 100–120 km/h → 100m.',
      legalBasis:
        'Khoảng cách an toàn tối thiểu giữa hai xe phải bảo đảm đủ thời gian phản xạ và phanh dừng theo tốc độ lưu hành.',
    };
  }

  // 5. Tuổi & Hạng GPLX / Niên hạn
  if (text.includes('tuổi') || text.includes('giấy phép lái xe hạng')) {
    return {
      quickTip: '18 tuổi (A1, A, B1, B, C1) • 21 tuổi (C) • 24 tuổi (D1, D2) • 27 tuổi (D).',
      legalBasis: `Theo phân hạng GPLX mới 2026: "${shortText(ans)}".`,
    };
  }

  if (text.includes('niên hạn')) {
    return {
      quickTip: 'Xe ô tô tải: tối đa 25 năm • Xe ô tô chở người > 9 chỗ: tối đa 20 năm.',
      legalBasis: `Quy định niên hạn sử dụng phương tiện: "${shortText(ans)}".`,
    };
  }

  // 6. Đèn cảnh báo Taplo (Chương 3 & 4)
  if (
    (q.chapter === 3 || q.chapter === 4) &&
    (text.includes('bảng đồng hồ') || text.includes('ký hiệu'))
  ) {
    return {
      quickTip: `Ký hiệu này báo hiệu: "${shortText(ans, 70)}".`,
      legalBasis:
        'Quy tắc màu taplo: Đèn ĐỎ cảnh báo nguy hiểm cần dừng kiểm tra ngay (phanh, dầu, nhiệt độ, cửa mở, ắc quy); đèn VÀNG báo cần bảo dưỡng/kiểm tra (Check Engine, ABS, áp suất lốp).',
    };
  }

  // 7. Chương 5: Báo hiệu đường bộ
  if (q.chapter === 5) {
    if (text.includes('vạch')) {
      return {
        quickTip: 'Vạch VÀNG chia 2 chiều ngược nhau; Vạch TRẮNG chia làn cùng chiều; ĐỨT được đè, LIỀN cấm đè.',
        legalBasis: `Căn cứ quy chuẩn vạch kẻ đường: "${shortText(ans)}".`,
      };
    }
    if (text.includes('cấm')) {
      return {
        quickTip: 'Biển tròn viền đỏ là biển CẤM. Cấm xe nhỏ thì cấm luôn xe lớn; cấm rẽ trái vẫn được quay đầu.',
        legalBasis: `Theo ý nghĩa biển báo cấm trong hình: "${shortText(ans)}".`,
      };
    }
    if (text.includes('nguy hiểm') || text.includes('cảnh báo')) {
      return {
        quickTip: 'Tam giác vàng viền đỏ là biển NGUY HIỂM; riêng tam giác lộn ngược là giao với đường ưu tiên.',
        legalBasis: `Biển cảnh báo nguy hiểm phía trước: "${shortText(ans)}".`,
      };
    }
    if (text.includes('hiệu lệnh') || text.includes('bắt buộc')) {
      return {
        quickTip: 'Biển tròn nền xanh lam là biển HIỆU LỆNH bắt buộc phải thi hành theo mũi tên hoặc trị số.',
        legalBasis: `Hiệu lệnh bắt buộc từ biển báo: "${shortText(ans)}".`,
      };
    }
    return {
      quickTip: `Tròn đỏ = Cấm • Tam giác vàng = Nguy hiểm • Tròn xanh = Hiệu lệnh • Vuông xanh = Chỉ dẫn.`,
      legalBasis: `Đối chiếu ký hiệu và biển phụ trong hình: "${shortText(ans)}".`,
    };
  }

  // 8. Chương 6: Giải thế sa hình & Tình huống (phân loại đúng theo câu hỏi!)
  if (q.chapter === 6) {
    if (
      text.includes('thứ tự') ||
      text.includes('được quyền đi trước') ||
      text.includes('đi như thế nào là đúng quy tắc')
    ) {
      return {
        quickTip: '5 bước sa hình: Nhất chớm → Nhì ưu (Hỏa-Sự-An-Thương) → Tam đường → Tứ hướng → Ngũ hành.',
        legalBasis: `Thứ tự di chuyển đúng quy tắc qua giao lộ: "${shortText(ans)}".`,
      };
    }
    if (text.includes('đỗ') || text.includes('dừng')) {
      return {
        quickTip: 'Cấm dừng/đỗ trên cầu, hầm, giao lộ, phần đường đi bộ, ngược chiều hoặc nơi có biển cấm.',
        legalBasis: `Kiểm tra vị trí xe và biển báo cấm dừng/đỗ: "${shortText(ans)}".`,
      };
    }
    if (
      text.includes('vi phạm') ||
      text.includes('chấp hành') ||
      text.includes('đúng hay sai') ||
      text.includes('được phép')
    ) {
      return {
        quickTip: 'Soi 3 yếu tố: Biển báo trên làn, Vạch kẻ đường (liền/đứt), và Mũi tên/Đèn tín hiệu.',
        legalBasis: `Kết luận theo tình huống trong hình: "${shortText(ans)}".`,
      };
    }
    return {
      quickTip: `Quan sát hướng mũi tên, điểm mù xe lớn và biển báo trong hình → "${shortText(ans, 60)}".`,
      legalBasis:
        'Ưu tiên giữ khoảng cách an toàn, nhường đường cho phương tiện được ưu tiên và tuân thủ vạch kẻ/biển báo.',
    };
  }

  // 9. Câu Điểm Liệt (Chapter 1, 2, 3)
  if (q.isCritical) {
    if (ansLower.includes('bị nghiêm cấm') || ansLower.includes('không được')) {
      return {
        quickTip: 'Thấy "Bị nghiêm cấm" hoặc "Không được..." → Chọn ngay!',
        legalBasis:
          'Câu điểm liệt về hành vi bị nghiêm cấm. Sai 1 câu điểm liệt sẽ trượt toàn bộ bài thi.',
      };
    }
    if (ansLower.includes('cả hai') || ansLower.includes('cả ba')) {
      return {
        quickTip: `Các ý đều nêu đúng quy tắc an toàn → Chọn "${ans}".`,
        legalBasis:
          'Đây là câu điểm liệt kiểm tra nguyên tắc an toàn tối thiểu khi tham gia giao thông.',
      };
    }
    return {
      quickTip: `Câu điểm liệt: Chọn phương án an toàn tuyệt đối — "${shortText(ans, 65)}".`,
      legalBasis:
        'Sai 1 câu điểm liệt sẽ bị đánh trượt ngay lập tức dù các câu khác đều đúng.',
    };
  }

  // 10. Các câu Chương 1–4 còn lại
  if (ansLower.includes('cả hai') || ansLower.includes('cả ba')) {
    return {
      quickTip: `Các ý trên đều đúng và bổ sung cho nhau → Chọn "${ans}".`,
      legalBasis:
        'Tổng hợp đầy đủ các điều kiện pháp lý và quy tắc an toàn giao thông đường bộ.',
    };
  }

  return {
    quickTip: `Chốt ý đúng: "${shortText(ans, 75)}"`,
    legalBasis:
      'Tuân thủ quy tắc nhường đường, bảo đảm an toàn kỹ thuật và chấp hành báo hiệu đường bộ.',
  };
}

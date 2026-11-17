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

export function getQuestionExplanation(q: Question): {
  quickTip: string;
  legalBasis: string;
} {
  if (q.explanation && q.explanation.trim()) {
    return {
      quickTip: 'Ghi nhớ quy tắc chuẩn của Cục CSGT 2025.',
      legalBasis: q.explanation,
    };
  }

  const text = q.question.toLowerCase();
  const ans = q.options[q.correctAnswer] || '';
  const ansLower = ans.toLowerCase();

  if (q.isCritical) {
    if (ansLower.includes('không được') || ansLower.includes('bị nghiêm cấm')) {
      return {
        quickTip: 'Thấy cụm từ "Bị nghiêm cấm" hoặc "Không được..." → Chọn ngay!',
        legalBasis:
          'Câu điểm liệt về hành vi bị nghiêm cấm. Sai 1 câu điểm liệt sẽ bị đánh trượt toàn bộ bài thi.',
      };
    }
    if (text.includes('rào chắn') || text.includes('đường sắt')) {
      return {
        quickTip: 'Gặp rào chắn / đường sắt → Dừng lại trước rào chắn khoảng cách an toàn.',
        legalBasis:
          'Luật TTATGTĐB quy định người tham gia giao thông phải dừng lại nhường đường tuyệt đối cho phương tiện đường sắt.',
      };
    }
    return {
      quickTip: 'Ưu tiên tuyệt đối phương án giảm tốc độ, nhường đường hoặc dừng quan sát.',
      legalBasis:
        'Đây là câu hỏi điểm liệt kiểm tra ý thức an toàn tối thiểu khi tham gia giao thông.',
    };
  }

  if (q.chapter === 6) {
    return {
      quickTip: 'Nhất chớm → Nhì ưu (Hỏa-Sự-An-Thương) → Tam đường → Tứ hướng → Ngũ hành.',
      legalBasis:
        'Áp dụng đúng 5 bước giải sa hình: xe vào giao lộ trước, xe ưu tiên, đường ưu tiên, bên phải không vướng, rẽ phải → đi thẳng → rẽ trái.',
    };
  }

  if (q.chapter === 5) {
    if (text.includes('cấm')) {
      return {
        quickTip: 'Cấm xe nhỏ thì cấm luôn xe lớn; cấm rẽ trái VẪN ĐƯỢC quay đầu (trừ biển cấm riêng).',
        legalBasis:
          'Biển báo cấm (hình tròn viền đỏ) có hiệu lực từ vị trí đặt biển trở đi trên làn đường hoặc đoạn đường quy định.',
      };
    }
    if (text.includes('nguy hiểm') || text.includes('giao nhau')) {
      return {
        quickTip: 'Tam giác vàng nét dọc dày = mình trên đường ưu tiên; tam giác lộn ngược = nhường đường.',
        legalBasis:
          'Biển báo nguy hiểm (tam giác vàng viền đỏ) cảnh báo trước các tình huống mất an toàn để người lái chủ động giảm tốc.',
      };
    }
    if (text.includes('hiệu lệnh') || text.includes('bắt buộc')) {
      return {
        quickTip: 'Biển tròn nền xanh lam = Bắt buộc phải thi hành theo mũi tên hoặc trị số.',
        legalBasis:
          'Nhóm biển hiệu lệnh quy định hướng đi bắt buộc, làn đường dành riêng hoặc tốc độ tối thiểu cho phép.',
      };
    }
    return {
      quickTip: 'Tròn đỏ = Cấm • Tam giác vàng = Nguy hiểm • Tròn xanh = Hiệu lệnh • Vuông xanh = Chỉ dẫn.',
      legalBasis:
        'Quan sát kỹ hình dạng, màu sắc biển chính và ký hiệu phạm vi/hướng tác dụng trên biển phụ bên dưới.',
    };
  }

  if (q.chapter === 3 || q.chapter === 4) {
    if (text.includes('bảng đồng hồ') || text.includes('ký hiệu')) {
      return {
        quickTip: 'Đèn ĐỎ = Nguy hiểm dừng ngay (phanh, dầu, nhiệt, ắc quy) • Đèn VÀNG = Kiểm tra (ABS, động cơ, lốp).',
        legalBasis:
          'Hệ thống cảnh báo trên bảng taplo giúp người lái nhận biết sớm sự cố kỹ thuật để xử lý an toàn.',
      };
    }
    return {
      quickTip: 'Xuống dốc dài về số thấp; qua đường ngập/trơn giữ đều ga, không đánh lái ngoặt.',
      legalBasis:
        'Kỹ thuật lái xe an toàn kết hợp phanh động cơ và kiểm soát lực kéo giúp xe ổn định trên địa hình phức tạp.',
    };
  }

  if (text.includes('tốc độ')) {
    return {
      quickTip: 'Trong khu đông dân cư: Đường đôi 60 km/h, Đường 2 chiều 50 km/h.',
      legalBasis:
        'Ngoài khu đông dân cư, tốc độ tối đa giảm dần theo tải trọng xe: 90/80 → 80/70 → 70/60 → 60/50 km/h.',
    };
  }

  if (text.includes('khoảng cách')) {
    return {
      quickTip: '60 km/h → 35m • 80 km/h → 55m • 100 km/h → 70m • 120 km/h → 100m.',
      legalBasis:
        'Khoảng cách an toàn tối thiểu giữa hai xe được quy định tương ứng theo dải vận tốc lưu hành thực tế.',
    };
  }

  if (ansLower.includes('cả hai') || ansLower.includes('cả ba')) {
    return {
      quickTip: 'Các ý trên đều đúng và bổ sung cho nhau → Chọn phương án tổng hợp.',
      legalBasis: `Đáp án "${ans}" bao gồm đầy đủ các điều kiện pháp lý và an toàn giao thông được nêu.`,
    };
  }

  return {
    quickTip: `Chốt nhanh từ khóa: "${ans.slice(0, 80)}${ans.length > 80 ? '...' : ''}"`,
    legalBasis:
      'Tuân thủ đúng quy tắc nhường đường, bảo đảm an toàn và chấp hành báo hiệu đường bộ.',
  };
}

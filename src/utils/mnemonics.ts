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

export function getQuestionExplanation(q: Question): { tip: string; rule: string } {
  if (q.explanation && q.explanation.trim()) {
    return { tip: q.explanation, rule: 'Giải thích chuẩn' };
  }

  const text = q.question.toLowerCase();
  const ans = q.options[q.correctAnswer] || '';
  const ansLower = ans.toLowerCase();

  if (q.isCritical) {
    if (ansLower.includes('không được') || ansLower.includes('bị nghiêm cấm')) {
      return {
        rule: 'Điểm liệt — An toàn tuyệt đối',
        tip: 'Câu điểm liệt về hành vi nguy hiểm: ưu tiên chọn phương án có cụm từ "Không được..." hoặc "Bị nghiêm cấm". Chỉ cần sai 1 câu điểm liệt sẽ trượt toàn bài thi.',
      };
    }
    if (text.includes('rào chắn') || text.includes('đường sắt')) {
      return {
        rule: 'Điểm liệt — Giao cắt đường sắt',
        tip: 'Khi có rào chắn dịch chuyển hoặc chuông/đèn báo hiệu đường sắt: bắt buộc dừng lại trước rào chắn một khoảng cách an toàn.',
      };
    }
    return {
      rule: 'Điểm liệt — Quy tắc cốt lõi',
      tip: 'Luôn ưu tiên phương án bảo đảm an toàn cao nhất: giảm tốc độ, nhường đường, dừng lại quan sát hoặc tuân thủ tuyệt đối hiệu lệnh.',
    };
  }

  if (q.chapter === 6) {
    return {
      rule: 'Mẹo giải sa hình 5 bước',
      tip: 'Áp dụng thứ tự: 1. Nhất chớm (xe vào giao lộ trước) → 2. Nhì ưu (Hỏa - Sự - An - Thương) → 3. Tam đường (biển đường ưu tiên) → 4. Tứ hướng (bên phải không vướng) → 5. Ngũ hành (rẽ phải → đi thẳng → rẽ trái).',
    };
  }

  if (q.chapter === 5) {
    if (text.includes('cấm')) {
      return {
        rule: 'Nhóm biển báo cấm (Viền đỏ, nền trắng)',
        tip: 'Biển cấm có hiệu lực từ vị trí đặt biển trở đi. Lưu ý quy tắc: Cấm xe nhỏ (ô tô con) thì cấm luôn xe lớn (tải, khách); cấm rẽ trái vẫn được quay đầu (trừ biển cấm quay đầu riêng).',
      };
    }
    if (text.includes('nguy hiểm') || text.includes('giao nhau')) {
      return {
        rule: 'Nhóm biển báo nguy hiểm (Tam giác vàng, viền đỏ)',
        tip: 'Biển tam giác vàng cảnh báo nguy hiểm phía trước. Đặc biệt chú ý phân biệt "Giao nhau với đường không ưu tiên" (nét dày dọc) và "Giao nhau với đường ưu tiên" (tam giác lộn ngược).',
      };
    }
    if (text.includes('hiệu lệnh') || text.includes('bắt buộc')) {
      return {
        rule: 'Nhóm biển hiệu lệnh (Hình tròn xanh lam)',
        tip: 'Biển tròn nền xanh lam là biển hiệu lệnh bắt buộc người tham gia giao thông phải thi hành theo hướng mũi tên hoặc tốc độ tối thiểu ghi trên biển.',
      };
    }
    return {
      rule: 'Báo hiệu đường bộ',
      tip: 'Quan sát kỹ hình dạng biển (Tròn đỏ = Cấm, Tam giác vàng = Nguy hiểm, Tròn xanh = Hiệu lệnh, Vuông/Chữ nhật xanh = Chỉ dẫn) và các biển phụ bên dưới.',
    };
  }

  if (q.chapter === 3 || q.chapter === 4) {
    if (text.includes('bảng đồng hồ') || text.includes('ký hiệu')) {
      return {
        rule: 'Nhận diện đèn cảnh báo Taplo',
        tip: 'Đèn đỏ báo nguy hiểm/cần dừng ngay (phanh tay, thiếu dầu phanh, cửa mở, nhiệt độ nước làm mát cao, ắc quy); đèn vàng báo cần kiểm tra (Check Engine, ABS, áp suất lốp).',
      };
    }
    return {
      rule: 'Kỹ thuật & Cấu tạo ô tô',
      tip: 'Khi xuống dốc dài: về số thấp, kết hợp phanh động cơ; khi qua đường ngập/trơn trượt: giữ đều ga, không đánh lái ngoặt, không rà phanh liên tục.',
    };
  }

  if (text.includes('tốc độ')) {
    return {
      rule: 'Mẹo nhớ Tốc độ tối đa',
      tip: 'Trong khu đông dân cư: Đường đôi = 60 km/h, Đường 2 chiều = 50 km/h. Ngoài khu đông dân cư: xe con/xe ≤ 3.5 tấn được đi 90 km/h (đường đôi) hoặc 80 km/h (đường 2 chiều).',
    };
  }

  if (text.includes('khoảng cách')) {
    return {
      rule: 'Mẹo nhớ Khoảng cách an toàn',
      tip: 'Lấy vận tốc lớn nhất trừ 30 để ước lượng nhanh: 60 km/h → 35m; 60–80 km/h → 55m; 80–100 km/h → 70m; 100–120 km/h → 100m.',
    };
  }

  if (ansLower.includes('cả hai') || ansLower.includes('cả ba')) {
    return {
      rule: 'Tổng hợp đầy đủ ý đúng',
      tip: `Đáp án đúng là "${ans}" vì các phương án còn lại đều nêu đúng các điều kiện an toàn hoặc quy định pháp luật liên quan.`,
    };
  }

  return {
    rule: 'Ghi nhớ từ khóa trọng tâm',
    tip: `Tập trung vào cụm từ khóa quyết định trong đáp án đúng: "${ans.slice(0, 95)}${ans.length > 95 ? '...' : ''}".`,
  };
}

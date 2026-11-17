export interface SimOption {
  label: 'A' | 'B' | 'C';
  text: string;
  isCorrect: boolean;
}

export interface SimQuestionParts {
  part1: SimOption[]; // 1. Tên tình huống (0,25đ)
  part2: SimOption[]; // 2. Dấu hiệu nhận biết gián tiếp (0,25đ)
  part3: SimOption[]; // 3. Dấu hiệu nhận biết trực tiếp (0,25đ)
  part4: SimOption[]; // 4. Phương án xử lý an toàn (0,25đ)
}

export interface SimSituation {
  id: number;
  chapter: number;
  name: string;
  indirect: string;
  direct: string;
  action: string;
  videoUrl: string;
  parts: SimQuestionParts;
}

export interface SimChapterMeta {
  id: number;
  name: string;
  shortName: string;
  count: number;
  range: [number, number];
  description: string;
}

export interface SimExamSet {
  maDe: number;
  questions: number[];
}

export const SIM_CHAPTERS: SimChapterMeta[] = [
  {
    id: 1,
    name: 'Chương 1: Giao thông trong đô thị',
    shortName: 'Đô thị',
    count: 29,
    range: [1, 29],
    description: 'Người đi bộ khuất tầm nhìn, xe buýt dừng đón trả khách, xe con/xe máy chuyển làn và ngã tư đô thị.',
  },
  {
    id: 2,
    name: 'Chương 2: Giao thông ngoài đô thị (Nông thôn)',
    shortName: 'Ngoại thị',
    count: 14,
    range: [30, 43],
    description: 'Đường làng gấp khúc, gia súc qua đường, đi ban đêm bị chói đèn pha, cầu hẹp nông thôn.',
  },
  {
    id: 3,
    name: 'Chương 3: Giao thông trên đường cao tốc',
    shortName: 'Cao tốc',
    count: 20,
    range: [44, 63],
    description: 'Xe nhập làn cao tốc, chuyển làn đột ngột, xe phanh gấp, chướng ngại vật và lùi xe trên cao tốc.',
  },
  {
    id: 4,
    name: 'Chương 4: Giao thông trên đường núi',
    shortName: 'Đường núi',
    count: 10,
    range: [64, 73],
    description: 'Khúc cua tay áo khuất tầm nhìn, lên xuống dốc đèo, sương mù, đá lở và xe vượt trên đèo.',
  },
  {
    id: 5,
    name: 'Chương 5: Giao thông trên đường quốc lộ',
    shortName: 'Quốc lộ',
    count: 17,
    range: [74, 90],
    description: 'Giao cắt đường sắt, xe tải lớn vượt nhau, xe đạp/xe máy băng qua quốc lộ.',
  },
  {
    id: 6,
    name: 'Chương 6: Các tình huống tai nạn giao thông thực tế',
    shortName: 'Tình huống thực tế',
    count: 30,
    range: [91, 120],
    description: 'Các tình huống va chạm hỗn hợp điển hình ngoài đời thực đòi hỏi phán đoán và xử lý sớm.',
  },
];

export const SIM_EXAM_SETS: SimExamSet[] = [
  {
    "maDe": 1,
    "questions": [
      57,
      46,
      62,
      19,
      33,
      52,
      49,
      13,
      80,
      69
    ]
  },
  {
    "maDe": 2,
    "questions": [
      63,
      58,
      77,
      15,
      71,
      39,
      16,
      14,
      52,
      6
    ]
  },
  {
    "maDe": 3,
    "questions": [
      32,
      69,
      14,
      5,
      6,
      25,
      37,
      70,
      41,
      46
    ]
  },
  {
    "maDe": 4,
    "questions": [
      3,
      33,
      77,
      35,
      51,
      7,
      6,
      11,
      27,
      22
    ]
  },
  {
    "maDe": 5,
    "questions": [
      79,
      23,
      14,
      35,
      65,
      75,
      71,
      69,
      20,
      18
    ]
  },
  {
    "maDe": 6,
    "questions": [
      75,
      5,
      10,
      45,
      55,
      32,
      61,
      20,
      31,
      67
    ]
  },
  {
    "maDe": 7,
    "questions": [
      32,
      68,
      49,
      18,
      67,
      72,
      24,
      56,
      7,
      61
    ]
  },
  {
    "maDe": 8,
    "questions": [
      75,
      20,
      7,
      74,
      4,
      6,
      24,
      52,
      5,
      21
    ]
  },
  {
    "maDe": 9,
    "questions": [
      76,
      63,
      45,
      5,
      72,
      6,
      33,
      40,
      15,
      31
    ]
  },
  {
    "maDe": 10,
    "questions": [
      6,
      63,
      69,
      79,
      26,
      47,
      48,
      72,
      35,
      40
    ]
  },
  {
    "maDe": 11,
    "questions": [
      71,
      9,
      49,
      11,
      16,
      77,
      27,
      35,
      33,
      5
    ]
  },
  {
    "maDe": 12,
    "questions": [
      10,
      7,
      5,
      1,
      47,
      25,
      52,
      4,
      40,
      38
    ]
  },
  {
    "maDe": 13,
    "questions": [
      24,
      48,
      54,
      32,
      69,
      2,
      76,
      35,
      19,
      70
    ]
  },
  {
    "maDe": 14,
    "questions": [
      11,
      62,
      80,
      44,
      64,
      10,
      74,
      52,
      26,
      57
    ]
  },
  {
    "maDe": 15,
    "questions": [
      29,
      23,
      63,
      78,
      6,
      69,
      7,
      77,
      73,
      32
    ]
  },
  {
    "maDe": 16,
    "questions": [
      14,
      46,
      37,
      22,
      29,
      31,
      74,
      9,
      66,
      20
    ]
  },
  {
    "maDe": 17,
    "questions": [
      31,
      10,
      64,
      6,
      2,
      78,
      35,
      74,
      57,
      52
    ]
  },
  {
    "maDe": 18,
    "questions": [
      3,
      78,
      30,
      38,
      19,
      13,
      49,
      1,
      12,
      64
    ]
  }
];

export const SIM_SITUATIONS: SimSituation[] = [
  {
    "id": 1,
    "chapter": 1,
    "name": "Người đi bộ sau xe tải",
    "indirect": "Xe tải lớn phía trước che khuất hoàn toàn tầm nhìn bên phải",
    "direct": "Người đi bộ bất ngờ bước ra sau xe tải",
    "action": "Chủ động rà phanh trước khi vượt qua điểm khuất, hạ tốc độ sâu, giữ khoảng cách an toàn và ưu tiên nhường đường",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/1.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ sau xe con",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải lớn phía trước che khuất hoàn toàn tầm nhìn bên phải",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Người đi bộ qua dãi phân cách",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Thấy xe tải lấn làn vượt lên",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Chủ động rà phanh trước khi vượt qua điểm khuất, hạ tốc độ sâu, giữ khoảng cách an toàn và ưu tiên nhường đường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 2,
    "chapter": 1,
    "name": "Người đi bộ qua dải phân cách",
    "indirect": "Khu vực có dải phân cách, thường có người băng qua không đúng nơi",
    "direct": "Người đi bộ bước xuống phần đường xe chạy",
    "action": "Giảm tốc từ sớm, quan sát hướng di chuyển của người đi bộ và dừng lại nếu họ tiếp tục sang đường",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/2.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ qua dải phân cách",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe phía trước tránh người đi bộ",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Khu vực có dải phân cách, thường có người băng qua không đúng nơi",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía lùi xe.",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bước xuống phần đường xe chạy",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe tải lớn phía trước che khuất hoàn toàn tầm nhìn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe bắt đầu đánh lái qua hướng trái",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc từ sớm, quan sát hướng di chuyển của người đi bộ và dừng lại nếu họ tiếp tục sang đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Tăng tốc từ sớm, không quan sát hướng di chuyển của người đi bộ và tiếp tục tăng tốc qua trước người đi bộ.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 3,
    "chapter": 1,
    "name": "Bò đứng giữa đường",
    "indirect": "Khu vực nông thôn ít rào chắn",
    "direct": "Động vật đứng trên phần đường",
    "action": "Giảm tốc sâu, bấm còi nhẹ nếu cần để cảnh báo",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/3.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Bò đứng giữa đường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Người dẫn bò ra giữa đường",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Bò di chuyển qua đường",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Khu vực nông thôn ít rào chắn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Khu vực đô thị ít rào chắn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Khu vực nông thôn có nhiều xe cộ",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Động vật đứng trên phần đường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Động vật đứng hết phần đường xe chạy",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có nhiều xe lưu thông",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc sâu, bấm còi nhẹ nếu cần để cảnh báo",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc từ sớm, quan sát hướng di chuyển của người đi bộ và dừng lại nếu họ tiếp tục sang đường",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chóng vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 4,
    "chapter": 1,
    "name": "Trẻ em chơi gần đường.",
    "indirect": "Có trẻ chơi ở lề đường.",
    "direct": "Trẻ chạy bất ngờ ra.",
    "action": "Đi rất chậm, giữ chân phanh để xử lý kịp.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/4.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Trẻ em chơi gần đường.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Có chướng ngại vật phái trước.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Trẻ em chơi hai bên đường",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Trẻ em chơi trong khuôn viên trường.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có trẻ chơi ở lề đường.",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Có chướng ngại vật phái trước",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Trẻ chạy bất ngờ ra.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Có xe trong ngõ rẽ ra bất ngờ",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có chướng ngại vật phái trước",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc sâu, bấm còi nhẹ nếu cần để cảnh báo",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đi rất chậm, giữ chân phanh để xử lý kịp.",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Có chướng ngại vật phái trước",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 5,
    "chapter": 1,
    "name": "Xe tải vượt",
    "indirect": "Xe tải phía sau có dấu hiệu tăng tốc",
    "direct": "Xe tải lấn làn để vượt",
    "action": "Giảm tốc, giữ khoảng cách an toàn và quan sát.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/5.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe tải vượt",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe con vượt",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải phía sau có dấu hiệu tăng tốc",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xuất hiện giao lộ hoặc đường nhánh nhỏ bên phải.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau tăng tốc, áp sát",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe tải lấn làn để vượt",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Có xe trong ngõ rẽ ra bất ngờ",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đạp bất ngờ lao ra từ bên hông",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Đi nhanh, giữ chân phanh để xử lý kịp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đạp phanh dứt khoát nhưng êm, giữ khoảng cách để tránh va chạm liên hoàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 6,
    "chapter": 1,
    "name": "Đường cong ban đêm",
    "indirect": "Tầm nhìn hạn chế.",
    "direct": "Không quan sát rõ phía trước",
    "action": "Giảm tốc, giữ khoảng cách an toàn và bật tín hiệu cảnh báo.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/6.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong ban đêm",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe tải vượt",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con vượt",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải phía sau có dấu hiệu tăng tốc",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Tầm nhìn hạn chế.",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tải vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe tải lấn làn để vượt",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Không quan sát rõ phía trước",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tải vượt",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Tăng tốc, không giữ khoảng cách an toàn và không bật tín hiệu cảnh báo.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đi nhanh, giữ chân phanh để xử lý kịp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và bật tín hiệu cảnh báo.",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 7,
    "chapter": 1,
    "name": "Đường cong ban ngày",
    "indirect": "Có biển cảnh báo",
    "direct": "Tầm nhìn bị khuất",
    "action": "Giảm tốc, giữ khoảng cách an toàn.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/7.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong ban đêm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đường cong ban ngày",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có biển cảnh báo",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Tầm nhìn hạn chế.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường cong ban ngày",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Sương mù dày",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Không quan sát rõ phía trước",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tầm nhìn bị khuất",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Đi nhanh, giữ chân phanh để xử lý kịp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường cong ban ngày",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 8,
    "chapter": 1,
    "name": "A)",
    "indirect": "Xe phía trước qua đường trơn",
    "direct": "Mặt đường ướt",
    "action": "Xe giảm tốc Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/8.mp4",
    "parts": {
      "part1": [
        {
          "label": "B",
          "text": "Đường cong ban ngày",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường ổ gà",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có ngõ nhỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Tầm nhìn hạn chế.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Mặt đường ướt",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe giảm tốc",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Không quan sát rõ phía trước",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giao lộ",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc sâu vì xe đạp khó kiểm soát.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đi nhanh, giữ chân phanh để xử lý kịp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 9,
    "chapter": 1,
    "name": "Bò qua đường",
    "indirect": "Khu vực nông thôn",
    "direct": "Bò di chuyển qua đường",
    "action": "Giảm tốc, giữ khoảng cách an toàn.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/9.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước qua đường trơn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò qua đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía trước vào khu dân cư",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Khu vực nông thôn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Tầm nhìn hạn chế.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Bị chói mắt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Bò di chuyển qua đường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Không quan sát rõ phía trước",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đánh lái",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Đi nhanh, giữ chân phanh để xử lý kịp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước vào khu dân cư",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 10,
    "chapter": 1,
    "name": "Xe phía trước quay đầu sai",
    "indirect": "Không đúng nơi quay đầu",
    "direct": "Xe quay đầu đột ngột",
    "action": "Giảm tốc, giữ khoảng cách an toàn.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/10.mp4",
    "parts": {
      "part1": [
        {
          "label": "B",
          "text": "Xe phía trước băng qua đường",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước quay đầu sai",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Không đúng nơi quay đầu",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Đúng nơi quay đầu.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có vật cản trên đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe quay đầu đột ngột",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Không quan sát rõ phía trước",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đi chậm",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Đi nhanh, giữ chân phanh để xử lý kịp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 11,
    "chapter": 1,
    "name": "Xe buýt dừng phía trước",
    "indirect": "Xe buýt đang dừng tại điểm đón trả khách",
    "direct": "Xe phía trước phanh lại hoặc người có thể bước ra từ đầu xe buýt",
    "action": "Giữ khoảng cách rộng hơn bình thường, giảm tốc và quan sát hai bên đầu xe buýt để phòng người đi bộ",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/11.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe buýt dừng phía trước",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tải phanh gấp",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải lớn phía trước che khuất hoàn toàn tầm nhìn bên phải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe buýt đang dừng tại điểm đón trả khách",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Thấy xe tải lấn làn vượt lên",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước phanh lại hoặc người có thể bước ra từ đầu xe buýt",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giữ khoảng cách rộng hơn bình thường, giảm tốc và quan sát hai bên đầu xe buýt để phòng người đi bộ",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 12,
    "chapter": 1,
    "name": "Xe con vượt phía trước",
    "indirect": "Xe phía trước chạy không ổn định, có xu hướng tăng tốc",
    "direct": "Xe đó lấn sang làn đối diện để vượt",
    "action": "Không tăng tốc theo, giảm ga và giữ khoảng cách để tránh tình huống dồn xe",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/12.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con vượt phía trước",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe phía trước chạy không ổn định, có xu hướng tăng tốc",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đó lấn sang làn đối diện để vượt",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Không tăng tốc theo, giảm ga và giữ khoảng cách để tránh tình huống dồn xe",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 13,
    "chapter": 1,
    "name": "Xe con bên trái đi ra",
    "indirect": "Có giao cắt bên trái nhưng tầm nhìn hạn chế",
    "direct": "Xe con tiến ra và có thể cắt ngang đầu xe bạn",
    "action": "Giảm tốc chủ động, giữ chân phanh và sẵn sàng dừng nếu xe kia không nhường",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/13.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con bên trái đi ra",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có giao cắt bên trái nhưng tầm nhìn hạn chế",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe con tiến ra và có thể cắt ngang đầu xe bạn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc chủ động, giữ chân phanh và sẵn sàng dừng nếu xe kia không nhường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 14,
    "chapter": 1,
    "name": "Xe tải tránh thi công",
    "indirect": "Khu vực có biển báo công trường",
    "direct": "Xe tải chuyển hướng tránh vật cản",
    "action": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/14.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe tải tránh thi công",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực có biển báo công trường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe tải chuyển hướng tránh vật cản",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 15,
    "chapter": 1,
    "name": "Xe tải tránh vật cản",
    "indirect": "Có vật cản trên đường",
    "direct": "Xe tải đánh lái tránh",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/15.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường thi công tiếp",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe tải tránh vật cản",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có vật cản trên đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe tải đánh lái tránh",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 16,
    "chapter": 1,
    "name": "Bò qua đường",
    "indirect": "Khu vực nông thôn",
    "direct": "Bò di chuyển qua đường",
    "action": "Giảm tốc, giữ khoảng cách an toàn.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/16.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Bò qua đường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Khu vực nông thôn",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 17,
    "chapter": 1,
    "name": "Dê đứng ven đường",
    "indirect": "Khu vực nông thôn",
    "direct": "Dê có thể lao ra",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/17.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Dê đứng ven đường",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Khu vực nông thôn",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Dê có thể lao ra",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 18,
    "chapter": 1,
    "name": "Xe máy từ nhánh ra",
    "indirect": "Có ngõ nhỏ",
    "direct": "Xe đi ra",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/18.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe máy từ nhánh ra",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có ngõ nhỏ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đi ra",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 19,
    "chapter": 1,
    "name": "Xe buýt vượt sai",
    "indirect": "Xe buýt phía sau xe con tăng tốc bất thường",
    "direct": "Giảm tốc độ đi sát làn bên phải",
    "action": null,
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/19.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường đang thi công",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có biển báo công trường",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau xe con tăng tốc bất thường",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xuất hiện rào chắn hoặc vật cản",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và đi đúng hướng dẫn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 20,
    "chapter": 1,
    "name": "Xe phía trước lùi",
    "indirect": "Xe phía trước dừng lâu bất thường",
    "direct": "Đèn lùi bật và xe bắt đầu di chuyển ngược",
    "action": "Dừng lại ở khoảng cách an toàn, không áp sát",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/20.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước lùi",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước dừng lâu bất thường",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn lùi bật và xe bắt đầu di chuyển ngược",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng lại ở khoảng cách an toàn, không áp sát",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 21,
    "chapter": 1,
    "name": "Xe buýt vượt",
    "indirect": "Xe buýt phía sau tăng tốc, áp sát",
    "direct": "Xe buýt lấn sang làn của bạn để vượt",
    "action": "Giảm tốc nhẹ để tạo khoảng trống, giữ hướng lái ổn định và quan sát gương",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/21.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe buýt dừng phía trước",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe buýt vượt",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải lớn phía trước che khuất hoàn toàn tầm nhìn bên phải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe buýt phía sau tăng tốc, áp sát",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Thấy xe tải lấn làn vượt lên",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe buýt lấn sang làn của bạn để vượt",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc nhẹ để tạo khoảng trống, giữ hướng lái ổn định và quan sát gương",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 22,
    "chapter": 1,
    "name": "Người đi bộ phía trước",
    "indirect": "Khu vực đông dân cư, gần vạch qua đường",
    "direct": "Xe phía trước phanh lại hoặc có người chuẩn bị sang đường",
    "action": "Hạ tốc độ, giữ khoảng cách và chuẩn bị dừng hẳn nếu người đi bộ bước ra",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/22.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ phía trước",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Khu vực đông dân cư, gần vạch qua đường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước phanh lại hoặc có người chuẩn bị sang đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Hạ tốc độ, giữ khoảng cách và chuẩn bị dừng hẳn nếu người đi bộ bước ra",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 23,
    "chapter": 1,
    "name": "Xe khách vượt",
    "indirect": "Xe khách phía sau tăng tốc",
    "direct": "Xe khách lấn làn để vượt",
    "action": "Giảm tốc nhẹ, giữ ổn định để họ vượt an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/23.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe khách vượt",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con bên trái đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe khách phía sau tăng tốc",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe khách lấn làn để vượt",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc nhẹ, giữ ổn định để họ vượt an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 24,
    "chapter": 1,
    "name": "Xe tải chuyển làn",
    "indirect": "Xe lớn di chuyển gần làn",
    "direct": "Xe lấn sang làn của bạn",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/24.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe tải chuyển làn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe lớn di chuyển gần làn",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe lấn sang làn của bạn",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 25,
    "chapter": 1,
    "name": "Xe tải cắt đầu",
    "indirect": "Xe lớn ở phía trước bên cạnh",
    "direct": "Xe đột ngột chuyển hướng cắt ngang đầu xe",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/25.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường thi công tiếp",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe tải cắt đầu",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe lớn ở phía trước bên cạnh",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đột ngột chuyển hướng cắt ngang đầu xe",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 26,
    "chapter": 1,
    "name": "Đường đèo núi",
    "indirect": "Đường quanh co, dốc",
    "direct": "Xe đối diện xuất hiện",
    "action": "Giảm tốc, giữ khoảng cách an toàn.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/26.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường đèo núi",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường quanh co, dốc",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đối diện xuất hiện",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 27,
    "chapter": 1,
    "name": "Xe đạp sang đường",
    "indirect": "Có xe đạp gần đường",
    "direct": "Xe đạp đi xuống đường",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/27.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đạp sang đường",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có xe đạp gần đường",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đạp đi xuống đường",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 28,
    "chapter": 1,
    "name": "Xe khách đổ dốc",
    "indirect": "Đường dốc dài",
    "direct": "Xe tăng tốc nhanh",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/28.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe khách đổ dốc",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đường dốc dài",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe tăng tốc nhanh",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 29,
    "chapter": 1,
    "name": "Xe phía trước ra tín hiệu chuyển làn",
    "indirect": "Xe đi sát vạch",
    "direct": "Xe chuyển làn đột ngột",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/Chuong_1_giao_thong_trong_do_thi/29.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước tránh người đi bộ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước ra tín hiệu chuyển làn",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đi sát vạch",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau xe con tăng tốc bất thường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe chuyển làn đột ngột",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 30,
    "chapter": 2,
    "name": "Xe taxi dừng đón khách",
    "indirect": "Xe taxi chạy chậm gần lề đường",
    "direct": "Xe dừng lại đột ngột",
    "action": "Giảm tốc, giữ khoảng cách an toàn và quan sát người lên xuống",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/30.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe taxi dừng đón khách",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe taxi chạy chậm gần lề đường",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe dừng lại đột ngột",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát người lên xuống",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 31,
    "chapter": 2,
    "name": "Xe mở cửa ven đường",
    "indirect": "Có xe đỗ sát lề phải",
    "direct": "Cửa xe bất ngờ mở ra",
    "action": "Giữ khoảng cách rộng với xe đỗ, giảm tốc khi đi sát",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/31.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe mở cửa ven đường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe buýt dừng phía trước",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con từ đường nhánh đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải lớn phía trước che khuất hoàn toàn tầm nhìn bên phải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có xe đỗ sát lề phải",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Cửa xe bất ngờ mở ra",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Thấy xe tải lấn làn vượt lên",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đầu xe con nhô ra, có xu hướng nhập vào đường chính",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giữ khoảng cách rộng với xe đỗ, giảm tốc khi đi sát",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 32,
    "chapter": 2,
    "name": "Xe mở cửa phía ngược chiều",
    "indirect": "Xe đỗ bên kia đường, có dấu hiệu hoạt động",
    "direct": "Ánh đèn hoặc chuyển động bất thường từ xe đó",
    "action": "Quan sát cả hai phía, giảm tốc đề phòng cửa mở hoặc người băng qua",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/32.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe mở cửa phía ngược chiều",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe đỗ bên kia đường, có dấu hiệu hoạt động",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Ánh đèn hoặc chuyển động bất thường từ xe đó",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Quan sát cả hai phía, giảm tốc đề phòng cửa mở hoặc người băng qua",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 33,
    "chapter": 2,
    "name": "Xe máy rẽ trái",
    "indirect": "Có phương tiện phía trước bật tín hiệu rẽ",
    "direct": "Xe máy bắt đầu chuyển hướng sang trái",
    "action": "Giảm tốc, giữ khoảng cách an toàn và theo dõi hướng rẽ",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/33.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe máy rẽ trái",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con bên trái đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có phương tiện phía trước bật tín hiệu rẽ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe máy bắt đầu chuyển hướng sang trái",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và theo dõi hướng rẽ",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 34,
    "chapter": 2,
    "name": "Xe chuyển làn",
    "indirect": "Xe phía trước đi sát vạch kẻ đường",
    "direct": "Xe chuyển sang làn của bạn",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/34.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe chuyển làn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước đi sát vạch kẻ đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe chuyển sang làn của bạn",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 35,
    "chapter": 2,
    "name": "Xe lùi trên cao tốc",
    "indirect": "Xe phía trước di chuyển bất thường",
    "direct": "Xe bật đèn lùi và di chuyển ngược",
    "action": "Giảm tốc, giữ khoảng cách an toàn và chỉ dừng xe khi cần thiết",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/35.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường thi công tiếp",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe lùi trên cao tốc",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển bất thường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe bật đèn lùi và di chuyển ngược",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và chỉ dừng xe khi cần thiết",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 36,
    "chapter": 2,
    "name": "Sương mù tiếp",
    "indirect": "Tầm nhìn giảm",
    "direct": "Không nhìn rõ",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/36.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Sương mù tiếp",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tầm nhìn giảm",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Không nhìn rõ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 37,
    "chapter": 2,
    "name": "Xe con sang đường",
    "indirect": "Giao cắt",
    "direct": "Xe băng qua",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/37.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con sang đường",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giao cắt",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe băng qua",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 38,
    "chapter": 2,
    "name": "Xe máy vượt đèn",
    "indirect": "Giao lộ",
    "direct": "Xe vượt đèn tín hiệu",
    "action": "Giảm tốc sâu, đi đúng làn tạm và chú ý người điều tiết",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/38.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe máy vượt đèn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Đường đang thi công",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giao lộ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe vượt đèn tín hiệu",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xuất hiện vật cản hoặc công nhân làm việc",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc sâu, đi đúng làn tạm và chú ý người điều tiết",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 39,
    "chapter": 2,
    "name": "Xe phía trước dừng tại vạch",
    "indirect": "Xe đi sát vạch",
    "direct": "Xe dừng đúng vạch",
    "action": "Giảm tốc và dừng xe theo đúng quy định",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/39.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước tránh người đi bộ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước dừng tại vạch",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đi sát vạch",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau xe con tăng tốc bất thường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe dừng đúng vạch",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc và dừng xe theo đúng quy định",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 40,
    "chapter": 2,
    "name": "Xe phía trước lấn làn",
    "indirect": "Xe không giữ đúng phần đường",
    "direct": "Xe lấn sang làn khác",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/40.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước lấn làn",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe không giữ đúng phần đường",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe lấn sang làn khác",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 41,
    "chapter": 2,
    "name": "Xe 16 chỗ từ nhánh",
    "indirect": "Có xe lớn chờ tại giao lộ",
    "direct": "Xe bắt đầu tiến ra chiếm làn",
    "action": "Giảm tốc sớm vì xe lớn khó quan sát, sẵn sàng nhường",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/41.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe buýt dừng phía trước",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe 16 chỗ từ nhánh",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải lớn phía trước che khuất hoàn toàn tầm nhìn bên phải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có xe lớn chờ tại giao lộ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Thấy xe tải lấn làn vượt lên",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe bắt đầu tiến ra chiếm làn",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc sớm vì xe lớn khó quan sát, sẵn sàng nhường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 42,
    "chapter": 2,
    "name": "Xe tải dừng che khuất",
    "indirect": "Xe tải dừng giữa đường gây khuất tầm nhìn",
    "direct": "Xe khác lấn làn để tránh",
    "action": "Không vượt ngay, giảm tốc và quan sát trước khi di chuyển tiếp",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/42.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe tải dừng che khuất",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải dừng giữa đường gây khuất tầm nhìn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe khác lấn làn để tránh",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Không vượt ngay, giảm tốc và quan sát trước khi di chuyển tiếp",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 43,
    "chapter": 2,
    "name": "Xe môi trường dừng",
    "indirect": "Xe chuyên dụng hoạt động trên đường",
    "direct": "Xe phía sau phải chuyển làn",
    "action": "Giảm tốc và giữ khoảng cách để tránh va chạm bất ngờ",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_2_giao_thong_ngoai_do_thi/43.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe môi trường dừng",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con bên trái đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe chuyên dụng hoạt động trên đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe phía sau phải chuyển làn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc và giữ khoảng cách để tránh va chạm bất ngờ",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 44,
    "chapter": 3,
    "name": "Xe máy từ ngõ đi ra",
    "indirect": "Có nhiều ngõ nhỏ",
    "direct": "Xe máy lao ra nhanh",
    "action": "Quan sát hai bên liên tục và giảm tốc từ trước",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/44.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe máy từ ngõ đi ra",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có nhiều ngõ nhỏ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe máy lao ra nhanh",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Quan sát hai bên liên tục và giảm tốc từ trước",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 45,
    "chapter": 3,
    "name": "Xe tải nhập làn",
    "indirect": "Có làn đường nhập",
    "direct": "Xe tải di chuyển vào làn chính",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/45.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường thi công tiếp",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe tải nhập làn",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có làn đường nhập",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe tải di chuyển vào làn chính",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 46,
    "chapter": 3,
    "name": "Xe phía trước dừng đột ngột",
    "indirect": "Khoảng cách giữa các xe bị thu hẹp",
    "direct": "Xe phía trước dừng lại",
    "action": "Giảm tốc kịp thời, giữ khoảng cách an toàn để tránh va chạm",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/46.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước dừng đột ngột",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Khoảng cách giữa các xe bị thu hẹp",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước dừng lại",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc kịp thời, giữ khoảng cách an toàn để tránh va chạm",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 47,
    "chapter": 3,
    "name": "Xe phía trước có trẻ em",
    "indirect": "Có ghế trẻ em hoặc hành khách",
    "direct": "Trẻ có thể xuống xe",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/47.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước có trẻ em",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có ghế trẻ em hoặc hành khách",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Trẻ có thể xuống xe",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 48,
    "chapter": 3,
    "name": "Sương mù tiếp",
    "indirect": "Tầm nhìn giảm",
    "direct": "Không nhìn rõ",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/48.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Sương mù tiếp",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Tầm nhìn giảm",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Không nhìn rõ",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 49,
    "chapter": 3,
    "name": "Xe phía trước tránh người đi bộ",
    "indirect": "Có người gần đường",
    "direct": "Xe phanh",
    "action": "Giảm tốc, giữ khoảng cách an toàn và nhường đường cho người đi bộ",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/49.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước tránh người đi bộ",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước tránh người đi bộ",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có người gần đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau xe con tăng tốc bất thường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phanh",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và nhường đường cho người đi bộ",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 50,
    "chapter": 3,
    "name": "Đường trơn trượt",
    "indirect": "Có biển cảnh báo, mặt đường bóng",
    "direct": "Xe trước có dấu hiệu trượt hoặc phanh",
    "action": "Giảm ga từ sớm, tránh phanh gấp và giữ khoảng cách dài hơn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/50.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đường trơn trượt",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có biển cảnh báo, mặt đường bóng",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe trước có dấu hiệu trượt hoặc phanh",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm ga từ sớm, tránh phanh gấp và giữ khoảng cách dài hơn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 51,
    "chapter": 3,
    "name": "Đèn đỏ chuyển xanh",
    "indirect": "Đang dừng tại giao lộ",
    "direct": "Đèn tín hiệu chuyển sang xanh",
    "action": "Không đi ngay, quan sát hai bên rồi mới tăng tốc theo đúng quy định",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/51.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe buýt dừng phía trước",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn đỏ chuyển xanh",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải lớn phía trước che khuất hoàn toàn tầm nhìn bên phải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đang dừng tại giao lộ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Thấy xe tải lấn làn vượt lên",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn tín hiệu chuyển sang xanh",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Không đi ngay, quan sát hai bên rồi mới tăng tốc theo đúng quy định",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 52,
    "chapter": 3,
    "name": "Đường trơn trượt",
    "indirect": "Có biển cảnh báo, mặt đường bóng",
    "direct": "Xe trước có dấu hiệu trượt hoặc phanh",
    "action": "Giảm ga từ sớm, tránh phanh gấp và giữ khoảng cách dài hơn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/52.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường trơn trượt",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có biển cảnh báo, mặt đường bóng",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe trước có dấu hiệu trượt hoặc phanh",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm ga từ sớm, tránh phanh gấp và giữ khoảng cách dài hơn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 53,
    "chapter": 3,
    "name": "Xe phía trước qua đường trơn",
    "indirect": "Mặt đường ướt",
    "direct": "Xe giảm tốc",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/53.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước qua đường trơn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con bên trái đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Mặt đường ướt",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe giảm tốc",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 54,
    "chapter": 3,
    "name": "Xe tải sang đường",
    "indirect": "Giao lộ rộng",
    "direct": "Xe tải băng ngang",
    "action": "Giảm tốc và ưu tiên nhường vì xe lớn khó dừng",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/54.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe tải sang đường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giao lộ rộng",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe tải băng ngang",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc và ưu tiên nhường vì xe lớn khó dừng",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 55,
    "chapter": 3,
    "name": "Xe con nhập làn",
    "indirect": "Đường nhập làn",
    "direct": "Xe đi vào làn chính",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/55.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường thi công tiếp",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe con nhập làn",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đường nhập làn",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đi vào làn chính",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 56,
    "chapter": 3,
    "name": "Xe đối diện nháy đèn",
    "indirect": "Xe đối diện có tín hiệu đèn",
    "direct": "Nháy đèn liên tục",
    "action": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/56.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe đối diện nháy đèn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đối diện có tín hiệu đèn",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Nháy đèn liên tục",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 57,
    "chapter": 3,
    "name": "Đường ổ gà",
    "indirect": "Mặt đường xấu",
    "direct": "Xe phía trước né tránh",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/57.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường ổ gà",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Mặt đường xấu",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước né tránh",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 58,
    "chapter": 3,
    "name": "Xe phía trước vào khúc cua",
    "indirect": "Giao lộ",
    "direct": "Xe đánh lái",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/58.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước vào khúc cua",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giao lộ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đánh lái",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 59,
    "chapter": 3,
    "name": "Xe phía trước đi chậm bất thường",
    "indirect": "Không rõ nguyên nhân",
    "direct": "Xe giảm tốc",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/59.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước tránh người đi bộ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước đi chậm bất thường",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Không rõ nguyên nhân",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau xe con tăng tốc bất thường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe giảm tốc",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 60,
    "chapter": 3,
    "name": "Xe phía trước qua trường học",
    "indirect": "Có biển báo",
    "direct": "Có học sinh",
    "action": "Giảm tốc, giữ khoảng cách an toàn và nhường đường cho người đi bộ",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/60.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước qua trường học",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có biển báo",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có học sinh",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và nhường đường cho người đi bộ",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 61,
    "chapter": 3,
    "name": "Xe tải phanh gấp",
    "indirect": "Xe tải phía trước ở khoảng cách gần",
    "direct": "Đèn phanh bật sáng đột ngột",
    "action": "Đạp phanh dứt khoát nhưng êm, giữ khoảng cách để tránh va chạm liên hoàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/61.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe tải phanh gấp",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải lớn phía trước che khuất hoàn toàn tầm nhìn bên phải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Thấy xe tải lấn làn vượt lên",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Đạp phanh dứt khoát nhưng êm, giữ khoảng cách để tránh va chạm liên hoàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 62,
    "chapter": 3,
    "name": "Đường hẹp có xe đối diện",
    "indirect": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
    "direct": "Xe đối diện tiến vào đoạn hẹp cùng lúc",
    "action": "Giảm tốc về mức an toàn, chủ động nhường nếu cần để tránh xung đột",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/62.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đối diện tiến vào đoạn hẹp cùng lúc",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc về mức an toàn, chủ động nhường nếu cần để tránh xung đột",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 63,
    "chapter": 3,
    "name": "Bò di chuyển qua đường.",
    "indirect": "Có đàn vật nuôi gần đường",
    "direct": "Con vật bắt đầu băng qua",
    "action": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_3_giao_thong_tren_cao_toc/63.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có đàn vật nuôi gần đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 64,
    "chapter": 4,
    "name": "Xe con xin vượt",
    "indirect": "Xe phía sau bật tín hiệu xin vượt",
    "direct": "Xe tiến sát phía sau",
    "action": "Giảm tốc, giữ khoảng cách an toàn và quan sát gương.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_4_giao_thong_tren_duong_nui/64.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe con xin vượt",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có đàn vật nuôi gần đường",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát gương.",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 65,
    "chapter": 4,
    "name": "Đường thi công tiếp",
    "indirect": "Công trường kéo dài",
    "direct": "Xe phía trước di chuyển chậm",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_4_giao_thong_tren_duong_nui/65.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường thi công tiếp",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 66,
    "chapter": 4,
    "name": "Đường cong khuất",
    "indirect": "Có vật che tầm nhìn",
    "direct": "Không thấy phía trước",
    "action": "Giảm tốc, giữ khoảng cách an toàn.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_4_giao_thong_tren_duong_nui/66.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 67,
    "chapter": 4,
    "name": "Xe phía trước bật tín hiệu rẽ trái",
    "indirect": "Xe có xu hướng dịch sang trái",
    "direct": "Xe bật xi nhan trái",
    "action": "Giảm tốc, giữ khoảng cách an toàn .",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_4_giao_thong_tren_duong_nui/67.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe bật xi nhan trái",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 68,
    "chapter": 4,
    "name": "Xe phía trước qua cầu hẹp.",
    "indirect": "Cầu nhỏ",
    "direct": "Xe đi chậm",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_4_giao_thong_tren_duong_nui/68.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Cầu nhỏ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe bật xi nhan trái",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 69,
    "chapter": 4,
    "name": "Xe buýt vượt sai",
    "indirect": "Xe buýt phía sau xe con tăng tốc bất thường",
    "direct": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
    "action": "Giảm tốc để tránh đối đầu, giữ hướng xe ổn định",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_4_giao_thong_tren_duong_nui/69.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau xe con tăng tốc bất thường",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc để tránh đối đầu, giữ hướng xe ổn định",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 70,
    "chapter": 4,
    "name": "Xe đi ngược chiều",
    "indirect": "Đường một chiều",
    "direct": "Xe đối diện đi ngược chiều đang tiến vào xe của bạn",
    "action": "Giảm tốc, giữ khoảng cách an toàn và chỉ dừng xe khi cần thiết",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_4_giao_thong_tren_duong_nui/70.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đi ngược chiều",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường một chiều",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đối diện đi ngược chiều đang tiến vào xe của bạn",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và chỉ dừng xe khi cần thiết",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 71,
    "chapter": 4,
    "name": "Xe con từ đường nhánh đi ra",
    "indirect": "Xuất hiện giao lộ hoặc đường nhánh nhỏ bên phải",
    "direct": "Đầu xe con nhô ra, có xu hướng nhập vào đường chính",
    "action": "Nhả ga sớm, rà phanh nhẹ và sẵn sàng dừng nếu xe kia tiếp tục tiến ra",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_4_giao_thong_tren_duong_nui/71.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe buýt dừng phía trước",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con từ đường nhánh đi ra",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải lớn phía trước che khuất hoàn toàn tầm nhìn bên phải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xuất hiện giao lộ hoặc đường nhánh nhỏ bên phải",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Thấy xe tải lấn làn vượt lên",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đầu xe con nhô ra, có xu hướng nhập vào đường chính",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Nhả ga sớm, rà phanh nhẹ và sẵn sàng dừng nếu xe kia tiếp tục tiến ra",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 72,
    "chapter": 4,
    "name": "Xe máy chuyển làn",
    "indirect": "Xe máy đi sát vạch phân làn, không giữ hướng ổn định",
    "direct": "Xe máy bất ngờ đánh lái sang làn của bạn",
    "action": "Chủ động giảm tốc, giữ khoảng cách lệch sang phía an toàn để tránh va chạm",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_4_giao_thong_tren_duong_nui/72.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe máy chuyển làn",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe máy đi sát vạch phân làn, không giữ hướng ổn định",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe máy bất ngờ đánh lái sang làn của bạn",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Chủ động giảm tốc, giữ khoảng cách lệch sang phía an toàn để tránh va chạm",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 73,
    "chapter": 4,
    "name": "Xe máy xuất hiện sau xe tải",
    "indirect": "Xe tải che khuất tầm nhìn",
    "direct": "Xe máy bất ngờ đi ra phía trước",
    "action": "Rà phanh trước khi vượt xe tải, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_4_giao_thong_tren_duong_nui/73.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe máy xuất hiện sau xe tải",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con bên trái đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe tải che khuất tầm nhìn",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe máy bất ngờ đi ra phía trước",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Rà phanh trước khi vượt xe tải, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 74,
    "chapter": 5,
    "name": "Xe tải chuyển làn",
    "indirect": "Xe lớn phía trước",
    "direct": "Xe đối diện lấn sang phần đường của bạn",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/74.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe tải chuyển làn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe lớn phía trước",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đối diện lấn sang phần đường của bạn",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 75,
    "chapter": 5,
    "name": "Xe con xin đường",
    "indirect": "Xe phía sau áp sát",
    "direct": "Có tín hiệu xin đường",
    "action": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/75.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường thi công tiếp",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe con xin đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía sau áp sát",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có tín hiệu xin đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 76,
    "chapter": 5,
    "name": "Xe tải làm rơi vật",
    "indirect": "Xe tải chở hàng",
    "direct": "Vật rơi xuống đường",
    "action": "Giảm tốc, giữ khoảng cách an toàn.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/76.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe tải làm rơi vật",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe tải chở hàng",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Vật rơi xuống đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 77,
    "chapter": 5,
    "name": "Xe công nghệ dừng đột ngột",
    "indirect": "Xe di chuyển không ổn định",
    "direct": "Xe dừng để đón trả khách",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/77.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe công nghệ dừng đột ngột",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe di chuyển không ổn định",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe dừng để đón trả khách",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 78,
    "chapter": 5,
    "name": "Đường đang thi công",
    "indirect": "Có biển báo công trường từ xa",
    "direct": "Xuất hiện vật cản hoặc công nhân làm việc",
    "action": "Giảm tốc sâu, đi đúng làn tạm và chú ý người điều tiết",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/78.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đường đang thi công",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có biển báo công trường từ xa",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xuất hiện vật cản hoặc công nhân làm việc",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc sâu, đi đúng làn tạm và chú ý người điều tiết",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 79,
    "chapter": 5,
    "name": "Xe phía trước chuyển làn không tín hiệu",
    "indirect": "Xe đi sát vạch",
    "direct": "Xe chuyển làn đột ngột",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/79.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước tránh người đi bộ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước chuyển làn không tín hiệu",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đi sát vạch",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau xe con tăng tốc bất thường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe chuyển làn đột ngột",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 80,
    "chapter": 5,
    "name": "Xe phía trước vào khu dân cư",
    "indirect": "Có biển báo",
    "direct": "Xe giảm tốc",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/80.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước vào khu dân cư",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có biển báo",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe giảm tốc",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 81,
    "chapter": 5,
    "name": "Xe đạp từ đường nhánh",
    "indirect": "Có lối nhỏ hoặc ngõ khuất bên đường",
    "direct": "Có lối nhỏ hoặc ngõ khuất bên đường",
    "action": "Quan sát hai bên liên tục, giảm tốc sâu và giữ khoảng cách phòng va chạm ngang",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/81.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đạp từ đường nhánh",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe con từ đường nhánh đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe tải lớn phía trước che khuất hoàn toàn tầm nhìn bên phải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có lối nhỏ hoặc ngõ khuất bên đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Thấy xe tải lấn làn vượt lên",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có lối nhỏ hoặc ngõ khuất bên đường",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Quan sát hai bên liên tục, giảm tốc sâu và giữ khoảng cách phòng va chạm ngang",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 82,
    "chapter": 5,
    "name": "Xe bê tông lấn làn",
    "indirect": "Xe tải lớn chiếm nhiều diện tích mặt đường",
    "direct": "Xe bê tông lấn sang phần đường của bạn",
    "action": "Giảm tốc và ép xe về phía an toàn (bên phải), tránh đi song song",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/82.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe bê tông lấn làn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe máy chuyển làn",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe máy đi sát vạch phân làn, không giữ hướng ổn định",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe tải lớn chiếm nhiều diện tích mặt đường",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe bê tông lấn sang phần đường của bạn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe máy bất ngờ đánh lái sang làn của bạn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc và ép xe về phía an toàn (bên phải), tránh đi song song",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 83,
    "chapter": 5,
    "name": "Xe con rẽ trái",
    "indirect": "Xe phía trước bật xi nhan trái",
    "direct": "Xe bắt đầu đánh lái qua hướng trái",
    "action": "Giữ khoảng cách lớn hơn, giảm tốc để tránh bị cắt đầu",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/83.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe máy xuất hiện sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con rẽ trái",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước bật xi nhan trái",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe máy bất ngờ đi ra phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe bắt đầu đánh lái qua hướng trái",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Rà phanh trước khi vượt xe tải, giữ khoảng cách an toàn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giữ khoảng cách lớn hơn, giảm tốc để tránh bị cắt đầu",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 84,
    "chapter": 5,
    "name": "Trẻ em sang đường",
    "indirect": "Gần trường học, khu dân cư",
    "direct": "Trẻ bước xuống đường không quan sát",
    "action": "Giảm tốc sớm, luôn sẵn sàng dừng và nhường đường",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/84.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Trẻ em sang đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Gần trường học, khu dân cư",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Trẻ bước xuống đường không quan sát",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe đối diện lấn sang phần đường của bạn",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc sớm, luôn sẵn sàng dừng và nhường đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và đi sát về bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 85,
    "chapter": 5,
    "name": "Sương mù dày",
    "indirect": "Tầm nhìn bị hạn chế",
    "direct": "Quan sát khó khăn",
    "action": "Giảm tốc, giữ khoảng cách an toàn và bật tín hiệu cảnh báo",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/85.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường thi công tiếp",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe con xin đường",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Sương mù dày",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía sau áp sát",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tầm nhìn bị hạn chế",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Quan sát khó khăn",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và bật tín hiệu cảnh báo",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 86,
    "chapter": 5,
    "name": "Xe phía trước chuyển hướng liên tục",
    "indirect": "Xe không giữ làn ổn định",
    "direct": "Xe đánh lái nhiều lần",
    "action": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/86.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước chuyển hướng liên tục",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe không giữ làn ổn định",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tải chở hàng",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đánh lái nhiều lần",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 87,
    "chapter": 5,
    "name": "Xe đạp sang đường",
    "indirect": "Có xe đạp gần đường",
    "direct": "Xe đạp đi qua đường",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/87.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đạp sang đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe công nghệ dừng đột ngột",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có xe đạp gần đường",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đạp đi qua đường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe dừng để đón trả khách",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 88,
    "chapter": 5,
    "name": "Xe máy đi ngược chiều",
    "indirect": "Xe máy đi sát dải phân cách đối diện",
    "direct": "Xe máy xuất hiện trước xe của bạn",
    "action": "Chủ động giảm tốc, giữ khoảng cách lệch sang phía an toàn để tránh va chạm",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/88.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe máy đi ngược chiều",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía trước đi ban đêm",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe máy đi sát dải phân cách đối diện",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Tầm nhìn kém",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe máy xuất hiện trước xe của bạn",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Chủ động giảm tốc, giữ khoảng cách lệch sang phía an toàn để tránh va chạm",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 89,
    "chapter": 5,
    "name": "Xe phía trước đi ban đêm",
    "indirect": "Ánh sáng yếu",
    "direct": "Tầm nhìn kém",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/89.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước đi ban đêm",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước chuyển làn không tín hiệu",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Ánh sáng yếu",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau xe con tăng tốc bất thường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe chuyển làn đột ngột",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tầm nhìn kém",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 90,
    "chapter": 5,
    "name": "Đường đèo núi",
    "indirect": "Đường quanh co, dốc",
    "direct": "có biển báo nguy hiểm",
    "action": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_5_giao_thong_tren_duong_quoc_lo/90.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đường đèo núi",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường quanh co, dốc",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "có biển báo nguy hiểm",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 91,
    "chapter": 6,
    "name": "Xe đạp sang đường",
    "indirect": "Có người đi xe đạp gần mép đường",
    "direct": "Xe đạp bắt đầu đi xuống lòng đường",
    "action": "Giảm tốc sớm, không bấm còi gấp, giữ khoảng cách để họ sang hết",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/91.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đạp sang đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe con từ đường nhánh đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có người đi xe đạp gần mép đường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xuất hiện giao lộ hoặc đường nhánh nhỏ bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đạp bắt đầu đi xuống lòng đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đầu xe con nhô ra, có xu hướng nhập vào đường chính",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Nhả ga sớm, rà phanh nhẹ và sẵn sàng dừng nếu xe kia tiếp tục tiến ra",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc sớm, không bấm còi gấp, giữ khoảng cách để họ sang hết",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 92,
    "chapter": 6,
    "name": "Xe từ nhánh trái đi ra",
    "indirect": "Có giao lộ bên trái, tầm nhìn bị che",
    "direct": "Xe từ bên trái tiến gần ra đường chính",
    "action": "Giảm tốc, quan sát sâu vào giao lộ và sẵn sàng dừng",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/92.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe từ nhánh trái đi ra",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có giao lộ bên trái, tầm nhìn bị che",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe từ bên trái tiến gần ra đường chính",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, quan sát sâu vào giao lộ và sẵn sàng dừng",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 93,
    "chapter": 6,
    "name": "Xe buýt vượt sai",
    "indirect": "Xe buýt phía sau tăng tốc bất thường",
    "direct": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
    "action": "Giảm tốc để tránh đối đầu, giữ hướng xe ổn định",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/93.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe máy xuất hiện sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe buýt vượt sai",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe con bên trái đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe buýt phía sau tăng tốc bất thường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe máy bất ngờ đi ra phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc để tránh đối đầu, giữ hướng xe ổn định",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 94,
    "chapter": 6,
    "name": "Xe khách tránh xe khác",
    "indirect": "Xe khách phía trước di chuyển bất thường",
    "direct": "Xe khách đánh lái sang làn khác",
    "action": "Giảm tốc và tăng khoảng cách để tránh bị ép",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/94.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe khách tránh xe khác",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe khách phía trước di chuyển bất thường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe khách đánh lái sang làn khác",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc và tăng khoảng cách để tránh bị ép",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 95,
    "chapter": 6,
    "name": "Xe con vượt ẩu",
    "indirect": "Đường hẹp, xe phía trước tăng tốc",
    "direct": "Xe con lấn sang làn ngược chiều để vượt",
    "action": "Giảm tốc, giữ khoảng cách an toàn và giữ đúng phần đường",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/95.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường thi công tiếp",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe con vượt ẩu",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đường hẹp, xe phía trước tăng tốc",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe con lấn sang làn ngược chiều để vượt",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và giữ đúng phần đường",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 96,
    "chapter": 6,
    "name": "Xe cứu thương",
    "indirect": "Nghe thấy tín hiệu còi ưu tiên",
    "direct": "Xe cứu thương tiến đến gần",
    "action": "Giảm tốc, bật tín hiệu cảnh báo và nhường đường theo quy định",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/96.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe cứu thương",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Nghe thấy tín hiệu còi ưu tiên",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe cứu thương tiến đến gần",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, bật tín hiệu cảnh báo và nhường đường theo quy định",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 97,
    "chapter": 6,
    "name": "Đường cong liên tiếp",
    "indirect": "Đường uốn lượn",
    "direct": "Xe dừng để đón trả khách",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/97.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường cong liên tiếp",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường uốn lượn",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe dừng để đón trả khách",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 98,
    "chapter": 6,
    "name": "Trẻ em sang đường",
    "indirect": "Khu dân cư",
    "direct": "Trẻ bước ra",
    "action": "Giảm tốc, giữ khoảng cách an toàn và nhường đường cho người đi bộ",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/98.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Trẻ em sang đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu dân cư",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Trẻ bước ra",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và nhường đường cho người đi bộ",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 99,
    "chapter": 6,
    "name": "Trẻ chạy ra đường",
    "indirect": "Có trẻ gần đường",
    "direct": "Trẻ chạy ra bất ngờ",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/99.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước tránh người đi bộ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Trẻ chạy ra đường",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có trẻ gần đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau xe con tăng tốc bất thường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Trẻ chạy ra bất ngờ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 100,
    "chapter": 6,
    "name": "Xe phía trước đi chậm",
    "indirect": "Tốc độ thấp bất thường",
    "direct": "Xe giữ tốc độ thấp",
    "action": "Giảm tốc phù hợp, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/100.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước đi chậm",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tốc độ thấp bất thường",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe giữ tốc độ thấp",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc phù hợp, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 101,
    "chapter": 6,
    "name": "Xe mở cửa trong khu đông",
    "indirect": "Xe đỗ bên đường",
    "direct": "Một xe mở cửa đột ngột",
    "action": "Đi chậm đều, giữ khoảng cách hai bên và sẵn sàng phanh",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/101.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe buýt dừng phía trước",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe mở cửa trong khu đông",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe đỗ bên đường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xuất hiện giao lộ hoặc đường nhánh nhỏ bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Thấy xe tải lấn làn vượt lên",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Một xe mở cửa đột ngột",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Đi chậm đều, giữ khoảng cách hai bên và sẵn sàng phanh",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 102,
    "chapter": 6,
    "name": "Xe phía trước lùi",
    "indirect": "Xe phía trước dừng lâu bất thường",
    "direct": "Đèn lùi bật và xe bắt đầu di chuyển ngược",
    "action": "Dừng lại ở khoảng cách an toàn, không áp sát",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/102.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước lùi",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe máy chuyển làn",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe máy đi sát vạch phân làn, không giữ hướng ổn định",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước dừng lâu bất thường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đèn lùi bật và xe bắt đầu di chuyển ngược",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng lại ở khoảng cách an toàn, không áp sát",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 103,
    "chapter": 6,
    "name": "Xe con rẽ trái nhanh",
    "indirect": "Giao lộ phía trước, xe có xu hướng tăng tốc",
    "direct": "Xe con đánh lái rẽ trái với tốc độ cao",
    "action": "Giảm tốc, giữ khoảng cách an toàn và quan sát hướng di chuyển của xe",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/103.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe con rẽ trái nhanh",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con bên trái đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giao lộ phía trước, xe có xu hướng tăng tốc",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe con đánh lái rẽ trái với tốc độ cao",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát hướng di chuyển của xe",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 104,
    "chapter": 6,
    "name": "Xe ngược chiều bị che khuất",
    "indirect": "Có xe lớn che khuất tầm nhìn phía trước",
    "direct": "Xe đối diện bất ngờ xuất hiện",
    "action": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/104.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe ngược chiều bị che khuất",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có xe lớn che khuất tầm nhìn phía trước",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đối diện bất ngờ xuất hiện",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 105,
    "chapter": 6,
    "name": "Xe chạy nhanh trong đường cong",
    "indirect": "Đường cong nguy hiểm",
    "direct": "Xe đối diện lao nhanh",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/105.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường thi công tiếp",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe chạy nhanh trong đường cong",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đường cong nguy hiểm",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe đối diện lao nhanh",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 106,
    "chapter": 6,
    "name": "Đường ổ gà",
    "indirect": "Mặt đường xấu",
    "direct": "Xe phía trước né tránh",
    "action": "Giảm tốc, giữ khoảng cách an toàn.",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/106.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường ổ gà",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Mặt đường xấu",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước né tránh",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn.",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 107,
    "chapter": 6,
    "name": "Xe phía trước quay đầu",
    "indirect": "Xe giảm tốc gần điểm quay đầu",
    "direct": "Xe đánh lái quay đầu",
    "action": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/107.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước quay đầu",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe giảm tốc gần điểm quay đầu",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đánh lái quay đầu",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và quan sát",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 108,
    "chapter": 6,
    "name": "Xe phía trước chở vật liệu rơi",
    "indirect": "Xe chở hàng rơi",
    "direct": "Vật liệu rơi xuống",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/108.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước chở vật liệu rơi",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe chở hàng rơi",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Vật liệu rơi xuống",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 109,
    "chapter": 6,
    "name": "Xe phía trước quay đầu sai",
    "indirect": "Không đúng nơi quay đầu",
    "direct": "Xe quay đầu đột ngột",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/109.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước tránh người đi bộ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe phía trước quay đầu sai",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Không đúng nơi quay đầu",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau xe con tăng tốc bất thường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe quay đầu đột ngột",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 110,
    "chapter": 6,
    "name": "Đèn tín hiệu chuyển sang đỏ",
    "indirect": "Giao thông đông",
    "direct": "Xe đi chậm",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/110.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đèn tín hiệu chuyển sang đỏ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giao thông đông",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đánh lái",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe đi chậm",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 111,
    "chapter": 6,
    "name": "Xe buýt xin đường",
    "indirect": "Xe buýt bật tín hiệu xin chuyển làn",
    "direct": "Xe bắt đầu di chuyển sang làn bạn",
    "action": "Chủ động giảm tốc để tạo khoảng trống an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/111.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Người đi bộ sang đường vượt đèn đỏ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe buýt xin đường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe con từ đường nhánh đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe buýt bật tín hiệu xin chuyển làn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Xuất hiện giao lộ hoặc đường nhánh nhỏ bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe bắt đầu di chuyển sang làn bạn",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đầu xe con nhô ra, có xu hướng nhập vào đường chính",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Chủ động giảm tốc để tạo khoảng trống an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 112,
    "chapter": 6,
    "name": "Đường đang thi công",
    "indirect": "Có biển báo công trường từ xa",
    "direct": "Xuất hiện vật cản hoặc công nhân làm việc",
    "action": "Giảm tốc sâu, đi đúng làn tạm và chú ý người điều tiết",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/112.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường đang thi công",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Người đi bộ sau xe tải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe máy chuyển làn",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Xe máy đi sát vạch phân làn, không giữ hướng ổn định",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Có biển báo công trường từ xa",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xuất hiện vật cản hoặc công nhân làm việc",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc sâu, đi đúng làn tạm và chú ý người điều tiết",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 113,
    "chapter": 6,
    "name": "Xe đạp từ ngõ đi ra",
    "indirect": "Khu dân cư đông",
    "direct": "Xe đạp đi ra thiếu quan sát",
    "action": "Giảm tốc sâu vì xe đạp khó kiểm soát",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/113.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe đạp từ ngõ đi ra",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe con bên trái đi ra",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu dân cư đông",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Người đi bộ đứng trên lề đường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đạp đi ra thiếu quan sát",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc sâu vì xe đạp khó kiểm soát",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc độ đi sát làn bên phải",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 114,
    "chapter": 6,
    "name": "Xe máy lách qua xe lớn",
    "indirect": "Có xe tải che khuất",
    "direct": "Xe máy bất ngờ chui ra",
    "action": "Không đi sát xe lớn, giữ khoảng cách và giảm tốc",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/114.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe máy lách qua xe lớn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có xe tải che khuất",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Con vật bắt đầu băng qua",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe máy bất ngờ chui ra",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Không đi sát xe lớn, giữ khoảng cách và giảm tốc",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 115,
    "chapter": 6,
    "name": "Đường đang thi công",
    "indirect": "Có biển báo công trường",
    "direct": "Xuất hiện rào chắn hoặc vật cản",
    "action": "Giảm tốc, giữ khoảng cách an toàn và đi đúng hướng dẫn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/115.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường thi công tiếp",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Đường đang thi công",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Đường hẹp, không đủ cho 2 xe tránh nhau dễ dàng",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có biển báo công trường",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía sau bật tín hiệu xin vượt",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Người đi bộ bất ngờ bước ra sau xe tải",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xuất hiện rào chắn hoặc vật cản",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Dừng hoặc đi rất chậm, không tăng tốc ép qua.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn và đi đúng hướng dẫn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 116,
    "chapter": 6,
    "name": "Xe tải chuyển làn",
    "indirect": "Xe lớn phía trước",
    "direct": "Xe chuyển sang làn khác",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/116.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe tải chuyển làn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đường hẹp có xe đối diện",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe lớn phía trước",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe chuyển sang làn khác",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe tiến sát phía sau",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, giữ khoảng cách an toàn",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 117,
    "chapter": 6,
    "name": "Xe 16 chỗ vào làn",
    "indirect": "Xe lớn ở đường bên",
    "direct": "Xe chuyển vào làn của bạn",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/117.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Bò di chuyển qua đường.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe 16 chỗ vào làn",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Công trường kéo dài",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe lớn ở đường bên",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Không thấy phía trước",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe chuyển vào làn của bạn",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 118,
    "chapter": 6,
    "name": "Xe phía trước chở vật liệu rơi",
    "indirect": "Xe chở hàng rời",
    "direct": "Vật liệu rơi xuống",
    "action": "Giảm tốc, giữ khoảng cách an toàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/118.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Đường cong khuất",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước chở vật liệu rơi",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe phía trước bật tín hiệu rẽ trái",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe chở hàng rời",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe có xu hướng dịch sang trái",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Vật liệu rơi xuống",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc, không giữ khoảng cách an toàn.",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Giảm tốc, giữ khoảng cách an toàn",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "id": 119,
    "chapter": 6,
    "name": "Xe 16 chỗ từ nhánh",
    "indirect": "Có xe lớn chờ tại giao lộ",
    "direct": "Xe bắt đầu tiến ra chiếm làn",
    "action": "Giảm tốc sớm vì xe lớn khó quan sát, sẵn sàng nhường",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/119.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe phía trước tránh người đi bộ",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước qua cầu hẹp.",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe 16 chỗ từ nhánh",
          "isCorrect": true
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Có xe lớn chờ tại giao lộ",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt phía sau xe con tăng tốc bất thường",
          "isCorrect": false
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe bắt đầu tiến ra chiếm làn",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe buýt lấn làn vượt trong điều kiện không an toàn",
          "isCorrect": false
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Giảm tốc sớm vì xe lớn khó quan sát, sẵn sàng nhường",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "id": 120,
    "chapter": 6,
    "name": "Xe tải phanh gấp",
    "indirect": "Xe tải phía trước ở khoảng cách gần",
    "direct": "Đèn phanh bật sáng đột ngột",
    "action": "Đạp phanh dứt khoát nhưng êm, giữ khoảng cách để tránh va chạm liên hoàn",
    "videoUrl": "https://mo-phong-giao-thong.github.io/videos/chuong_6_tai_nan_giao_thong_thuc_te/120.mp4",
    "parts": {
      "part1": [
        {
          "label": "A",
          "text": "Xe buýt vượt sai",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe tải phanh gấp",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Xe đi ngược chiều",
          "isCorrect": false
        }
      ],
      "part2": [
        {
          "label": "A",
          "text": "Có vật che tầm nhìn",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Khu vực nông thôn",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Xe tải phía trước ở khoảng cách gần",
          "isCorrect": true
        }
      ],
      "part3": [
        {
          "label": "A",
          "text": "Xe đi chậm",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Xe phía trước di chuyển chậm",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Đèn phanh bật sáng đột ngột",
          "isCorrect": true
        }
      ],
      "part4": [
        {
          "label": "A",
          "text": "Đạp phanh dứt khoát nhưng êm, giữ khoảng cách để tránh va chạm liên hoàn",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Giảm tốc độ đi sát làn bên phải",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Tăng tốc, nhanh chống vượt qua",
          "isCorrect": false
        }
      ]
    }
  }
];

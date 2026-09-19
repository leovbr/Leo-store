/* =========================================================
   LEOOSTORE — PRODUCTS
   ========================================================= */

const PRODUCTS = [
  /* =======================================================
     MOBILE LEGENDS
     ======================================================= */
  {
    id: "mobile-legends",
    slug: "mobile-legends",
    name: "Mobile Legends",
    image: "assets/icons/mobile-legends.webp",
    icon: "🎮",
    publisher: "Moonton",

    denominations: [
      { id: "ml-first-100", amount: "100 (50+50) Diamonds - First Top Up", price: 14619, category: "🤩 First Top Up (Double Diamonds)" },
      { id: "ml-first-300", amount: "300 (150+150) Diamonds - First Top Up", price: 43742, category: "🤩 First Top Up (Double Diamonds)" },
      { id: "ml-first-500", amount: "500 (250+250) Diamonds - First Top Up", price: 72641, category: "🤩 First Top Up (Double Diamonds)" },
      { id: "ml-first-1000", amount: "1000 (500+500) Diamonds - First Top Up", price: 147486, category: "🤩 First Top Up (Double Diamonds)" },
      { id: "ml-weekly-elite", amount: "Weekly Elite Pack", price: 14619, category: "🔥 Special Items" },
      { id: "ml-weekly", amount: "Weekly Diamond Pass", price: 28002, category: "🔥 Special Items" },
      { id: "ml-weekly-2", amount: "2x Weekly Diamond Pass", price: 64556, category: "🔥 Special Items" },
      { id: "ml-monthly-epic-special", amount: "Monthly Epic Pack", price: 72230, category: "🔥 Special Items" },
      { id: "ml-weekly-3", amount: "3x Weekly Diamond Pass", price: 96833, category: "🔥 Special Items" },
      { id: "ml-weekly-4", amount: "4x Weekly Diamond Pass", price: 129111, category: "🔥 Special Items" },
      { id: "ml-twilight", amount: "Twilight Pass", price: 144794, category: "🔥 Special Items" },
      { id: "ml-weekly-5", amount: "5x Weekly Diamond Pass", price: 161389, category: "🔥 Special Items" },
      { id: "ml-5", amount: "5 (5+0) Diamonds", price: 1629, category: "✨ Top Up Diamonds" },
      { id: "ml-11", amount: "11 (10+1) Diamonds", price: 3253, category: "✨ Top Up Diamonds" },
      { id: "ml-10", amount: "10 (9+1) Diamonds", price: 3377, category: "✨ Top Up Diamonds" },
      { id: "ml-12", amount: "12 (11+1) Diamonds", price: 3982, category: "✨ Top Up Diamonds" },
      { id: "ml-14", amount: "14 (13+1) Diamonds", price: 4367, category: "✨ Top Up Diamonds" },
      { id: "ml-15", amount: "15 (15+0) Diamonds", price: 5066, category: "✨ Top Up Diamonds" },
      { id: "ml-19", amount: "19 (17+2) Diamonds", price: 6192, category: "✨ Top Up Diamonds" },
      { id: "ml-22", amount: "22 (20+2) Diamonds", price: 6505, category: "✨ Top Up Diamonds" },
      { id: "ml-20", amount: "20 (18+2) Diamonds", price: 6754, category: "✨ Top Up Diamonds" },
      { id: "ml-28", amount: "28 (25+3) Diamonds", price: 9094, category: "✨ Top Up Diamonds" },
      { id: "ml-30", amount: "30 (28+2) Diamonds", price: 10131, category: "✨ Top Up Diamonds" },
      { id: "ml-34", amount: "34 (31+3) Diamonds", price: 11340, category: "✨ Top Up Diamonds" },
      { id: "ml-35", amount: "35 (32+3) Diamonds", price: 11891, category: "✨ Top Up Diamonds" },
      { id: "ml-36", amount: "36 (33+3) Diamonds", price: 11945, category: "✨ Top Up Diamonds" },
      { id: "ml-42", amount: "42 (38+4) Diamonds", price: 13148, category: "✨ Top Up Diamonds" },
      { id: "ml-44", amount: "44 (40+4 )Diamonds", price: 13580, category: "✨ Top Up Diamonds" },
      { id: "ml-45", amount: "45 (42+3) Diamonds", price: 14764, category: "✨ Top Up Diamonds" },
      { id: "ml-46", amount: "46 (42+4) Diamonds", price: 15322, category: "✨ Top Up Diamonds" },
      { id: "ml-56", amount: "56 (51+5) Diamonds", price: 16471, category: "✨ Top Up Diamonds" },
      { id: "ml-54", amount: "54 (49+5) Diamonds", price: 16957, category: "✨ Top Up Diamonds" },
      { id: "ml-59", amount: "59 (53+6) Diamonds", price: 17972, category: "✨ Top Up Diamonds" },
      { id: "ml-55", amount: "55 (50+5) Diamonds", price: 18604, category: "✨ Top Up Diamonds" },
      { id: "ml-64", amount: "64 (58+6) Diamonds", price: 19661, category: "✨ Top Up Diamonds" },
      { id: "ml-60", amount: "60 (55+5) Diamonds", price: 19908, category: "✨ Top Up Diamonds" },
      { id: "ml-70", amount: "70 (64+6) Diamonds", price: 21787, category: "✨ Top Up Diamonds" },
      { id: "ml-71", amount: "71 (64+7) Diamonds", price: 21954, category: "✨ Top Up Diamonds" },
      { id: "ml-86", amount: "86 (78+8) Diamonds", price: 22021, category: "✨ Top Up Diamonds" },
      { id: "ml-67", amount: "67 (62+5) Diamonds", price: 22117, category: "✨ Top Up Diamonds" },
      { id: "ml-74", amount: "74 (67+7) Diamonds", price: 23038, category: "✨ Top Up Diamonds" },
      { id: "ml-85", amount: "85 (77+8) Diamonds", price: 25960, category: "✨ Top Up Diamonds" },
      { id: "ml-88", amount: "88 (80+8) Diamonds", price: 27159, category: "✨ Top Up Diamonds" },
      { id: "ml-89", amount: "89 (81+8) Diamonds", price: 28344, category: "✨ Top Up Diamonds" },
      { id: "ml-92", amount: "92 (84+8) Diamonds", price: 28755, category: "✨ Top Up Diamonds" },
      { id: "ml-98", amount: "98 (89+9) Diamonds", price: 30536, category: "✨ Top Up Diamonds" },
      { id: "ml-100", amount: "100 (91+9) Diamonds", price: 31025, category: "✨ Top Up Diamonds" },
      { id: "ml-112-a", amount: "112 (102+10) Diamonds", price: 32937, category: "✨ Top Up Diamonds" },
      { id: "ml-110", amount: "110 (100+10) Diamonds", price: 34518, category: "✨ Top Up Diamonds" },
      { id: "ml-112-b", amount: "112 (101+11) Diamonds", price: 35007, category: "✨ Top Up Diamonds" },
      { id: "ml-113", amount: "113 (102+11) Diamonds", price: 35054, category: "✨ Top Up Diamonds" },
      { id: "ml-116", amount: "116 (105+11) Diamonds", price: 36132, category: "✨ Top Up Diamonds" },
      { id: "ml-129", amount: "129 (117+12) Diamonds", price: 39539, category: "✨ Top Up Diamonds" },
      { id: "ml-128", amount: "128 (116+12) Diamonds", price: 40114, category: "✨ Top Up Diamonds" },
      { id: "ml-140", amount: "140 (127+13) Diamonds", price: 43572, category: "✨ Top Up Diamonds" },
      { id: "ml-172", amount: "172 (156+16) Diamonds", price: 43891, category: "✨ Top Up Diamonds" },
      { id: "ml-148", amount: "148 (134+14) Diamonds", price: 45730, category: "✨ Top Up Diamonds" },
      { id: "ml-170", amount: "170 (154+16) Diamonds", price: 51469, category: "✨ Top Up Diamonds" },
      { id: "ml-176", amount: "176 (160+16) Diamonds", price: 54318, category: "✨ Top Up Diamonds" },
      { id: "ml-165", amount: "165 (150+15) Diamonds", price: 55617, category: "✨ Top Up Diamonds" },
      { id: "ml-223", amount: "223 (203+20) Diamonds", price: 65671, category: "✨ Top Up Diamonds" },
      { id: "ml-257", amount: "257 (234+23) Diamonds", price: 65687, category: "✨ Top Up Diamonds" },
      { id: "ml-222", amount: "222 (200+22) Diamonds", price: 68442, category: "✨ Top Up Diamonds" },
      { id: "ml-240", amount: "240 (217+23) Diamonds", price: 72726, category: "✨ Top Up Diamonds" },
      { id: "ml-241", amount: "241 (218+23) Diamonds", price: 73422, category: "✨ Top Up Diamonds" },
      { id: "ml-monthly-epic-diamond", amount: "Monthly Epic Pack", price: 84795, category: "✨ Top Up Diamonds" },
      { id: "ml-278", amount: "278 (253+25) Diamonds", price: 84985, category: "✨ Top Up Diamonds" },
      { id: "ml-277", amount: "277 (250+27) Diamonds", price: 85269, category: "✨ Top Up Diamonds" },
      { id: "ml-284-a", amount: "284 (257+27) Diamonds", price: 86306, category: "✨ Top Up Diamonds" },
      { id: "ml-284-b", amount: "284 (254+30) Diamonds", price: 87377, category: "✨ Top Up Diamonds" },
      { id: "ml-296", amount: "296 (256+40) Diamonds", price: 90044, category: "✨ Top Up Diamonds" },
      { id: "ml-275", amount: "275 (250+25) Diamonds", price: 92629, category: "✨ Top Up Diamonds" },
      { id: "ml-305", amount: "305 (276+29) Diamonds", price: 93082, category: "✨ Top Up Diamonds" },
      { id: "ml-336", amount: "336 (303+33) Diamonds", price: 98606, category: "✨ Top Up Diamonds" },
      { id: "ml-355", amount: "355 (317+38) Diamonds", price: 109256, category: "✨ Top Up Diamonds" },
      { id: "ml-370", amount: "370 (333+37) Diamonds", price: 113449, category: "✨ Top Up Diamonds" },
      { id: "ml-384", amount: "384 (346+38) Diamonds", price: 116516, category: "✨ Top Up Diamonds" },
      { id: "ml-406", amount: "406 (366+40) Diamonds", price: 123355, category: "✨ Top Up Diamonds" },
      { id: "ml-408", amount: "408 (367+41) Diamonds", price: 123802, category: "✨ Top Up Diamonds" },
      { id: "ml-429", amount: "429 (383+46) Diamonds", price: 131088, category: "✨ Top Up Diamonds" },
      { id: "ml-514", amount: "514 (468+46) Diamonds", price: 131373, category: "✨ Top Up Diamonds" },
      { id: "ml-600", amount: "600 (546+54) Diamonds", price: 153394, category: "✨ Top Up Diamonds" },
      { id: "ml-518", amount: "518 (467+51) Diamonds", price: 157834, category: "✨ Top Up Diamonds" },
      { id: "ml-570", amount: "570 (504+66) Diamonds", price: 164280, category: "✨ Top Up Diamonds" },
      { id: "ml-554", amount: "554 (500+54) Diamonds", price: 168125, category: "✨ Top Up Diamonds" },
      { id: "ml-568", amount: "568 (503+65) Diamonds", price: 168933, category: "✨ Top Up Diamonds" },
      { id: "ml-571", amount: "571 (505+66) Diamonds", price: 169970, category: "✨ Top Up Diamonds" },
      { id: "ml-706", amount: "706 (625+81) Diamonds", price: 175076, category: "✨ Top Up Diamonds" },
      { id: "ml-565", amount: "565 (500+65) Diamonds", price: 186793, category: "✨ Top Up Diamonds" },
      { id: "ml-716-a", amount: "716 (637+79) Diamonds", price: 214663, category: "✨ Top Up Diamonds" },
      { id: "ml-716-b", amount: "716 (633+83) Diamonds", price: 218511, category: "✨ Top Up Diamonds" },
      { id: "ml-878", amount: "878 (781+97) Diamonds", price: 218966, category: "✨ Top Up Diamonds" },
      { id: "ml-750", amount: "750 (668+82) Diamonds", price: 224383, category: "✨ Top Up Diamonds" },
      { id: "ml-790", amount: "790 (703+87) Diamonds", price: 237458, category: "✨ Top Up Diamonds" },
      { id: "ml-963", amount: "963 (859+104) Diamonds", price: 240762, category: "✨ Top Up Diamonds" },
      { id: "ml-875", amount: "875 (774+101) Diamonds", price: 258973, category: "✨ Top Up Diamonds" },
      { id: "ml-874", amount: "874 (779+95) Diamonds", price: 262354, category: "✨ Top Up Diamonds" },
      { id: "ml-1050", amount: "1050 (937+113) Diamonds", price: 262857, category: "✨ Top Up Diamonds" },
      { id: "ml-966", amount: "966 (836+130) Diamonds", price: 290606, category: "✨ Top Up Diamonds" },
      { id: "ml-1220", amount: "1220 (1093+127) Diamonds", price: 306448, category: "✨ Top Up Diamonds" },
      { id: "ml-1067", amount: "1067 (953+114) Diamonds", price: 317799, category: "✨ Top Up Diamonds" },
      { id: "ml-1048", amount: "1048 (936+112) Diamonds", price: 318062, category: "✨ Top Up Diamonds" },
      { id: "ml-1084", amount: "1084 (940+144) Diamonds", price: 326780, category: "✨ Top Up Diamonds" },
      { id: "ml-1163", amount: "1163 (1007+156) Diamonds", price: 329000, category: "✨ Top Up Diamonds" },
      { id: "ml-1136", amount: "1136 (1006+130) Diamonds", price: 337866, category: "✨ Top Up Diamonds" },
      { id: "ml-1192", amount: "1192 (1010+182) Diamonds", price: 339939, category: "✨ Top Up Diamonds" },
      { id: "ml-1412", amount: "1412 (1250+162) Diamonds", price: 350152, category: "✨ Top Up Diamonds" },
      { id: "ml-1155", amount: "1155 (1000+155) Diamonds", price: 374543, category: "✨ Top Up Diamonds" },
      { id: "ml-1358", amount: "1358 (1206+152) Diamonds", price: 409583, category: "✨ Top Up Diamonds" },
      { id: "ml-1669", amount: "1669 (1484+185) Diamonds", price: 415838, category: "✨ Top Up Diamonds" },
      { id: "ml-1446", amount: "1446 (1252+194) Diamonds", price: 435753, category: "✨ Top Up Diamonds" },
      { id: "ml-1506", amount: "1506 (1339+167) Diamonds", price: 447676, category: "✨ Top Up Diamonds" },
      { id: "ml-1704", amount: "1704 (1509+195) Diamonds", price: 506799, category: "✨ Top Up Diamonds" },
      { id: "ml-2195", amount: "2195 (1860+335) Diamonds", price: 522498, category: "✨ Top Up Diamonds" },
      { id: "ml-1770", amount: "1770 (1500+270) Diamonds", price: 539004, category: "✨ Top Up Diamonds" },
      { id: "ml-1765", amount: "1765 (1500+265) Diamonds", price: 560185, category: "✨ Top Up Diamonds" },
      { id: "ml-2010", amount: "2010 (1708+302) Diamonds", price: 562918, category: "✨ Top Up Diamonds" },
      { id: "ml-2539", amount: "2539 (2172+367) Diamonds", price: 610278, category: "✨ Top Up Diamonds" },
      { id: "ml-2398", amount: "2398 (2015+383) Diamonds", price: 657998, category: "✨ Top Up Diamonds" },
      { id: "ml-2380", amount: "2380 (2041+339) Diamonds", price: 675999, category: "✨ Top Up Diamonds" },
      { id: "ml-2901", amount: "2901 (2485+416) Diamonds", price: 697573, category: "✨ Top Up Diamonds" },
      { id: "ml-2578", amount: "2578 (2211+367) Diamonds", price: 731851, category: "✨ Top Up Diamonds" },
      { id: "ml-2855", amount: "2855 (2461+394) Diamonds", price: 820088, category: "✨ Top Up Diamonds" },
      { id: "ml-3005", amount: "3005 (2525+480) Diamonds", price: 849848, category: "✨ Top Up Diamonds" },
      { id: "ml-3688", amount: "3688 (3099+589) Diamonds", price: 871676, category: "✨ Top Up Diamonds" },
      { id: "ml-2976", amount: "2976 (2501+475) Diamonds", price: 873994, category: "✨ Top Up Diamonds" },
      { id: "ml-2975", amount: "2975 (2500+475) Diamonds", price: 878373, category: "✨ Top Up Diamonds" },
      { id: "ml-3146", amount: "3146 (2714+432) Diamonds", price: 900783, category: "✨ Top Up Diamonds" },
      { id: "ml-3423", amount: "3423 (2964+459) Diamonds", price: 992296, category: "✨ Top Up Diamonds" },
      { id: "ml-3606", amount: "3606 (3030+576) Diamonds", price: 1019817, category: "✨ Top Up Diamonds" },
      { id: "ml-4394", amount: "4394 (3724+670) Diamonds", price: 1046752, category: "✨ Top Up Diamonds" },
      { id: "ml-3738", amount: "3738 (3247+491) Diamonds", price: 1080871, category: "✨ Top Up Diamonds" },
      { id: "ml-4020", amount: "4020 (3416+604) Diamonds", price: 1125835, category: "✨ Top Up Diamonds" },
      { id: "ml-5532", amount: "5532 (4649+883) Diamonds", price: 1316673, category: "✨ Top Up Diamonds" },
      { id: "ml-4830", amount: "4830 (4003+827) Diamonds", price: 1350848, category: "✨ Top Up Diamonds" },
      { id: "ml-4810", amount: "4810 (4008+802) Diamonds", price: 1359756, category: "✨ Top Up Diamonds" },
      { id: "ml-4856", amount: "4856 (4027+829) Diamonds", price: 1376588, category: "✨ Top Up Diamonds" },
      { id: "ml-4958", amount: "4958 (4252+706) Diamonds", price: 1390966, category: "✨ Top Up Diamonds" },
      { id: "ml-5052", amount: "5052 (4203+849) Diamonds", price: 1419373, category: "✨ Top Up Diamonds" },
      { id: "ml-6238", amount: "6238 (5274+964) Diamonds", price: 1491748, category: "✨ Top Up Diamonds" },
      { id: "ml-5398", amount: "5398 (4506+892) Diamonds", price: 1519780, category: "✨ Top Up Diamonds" },
      { id: "ml-6042", amount: "6042 (5035+1007) Diamonds", price: 1645194, category: "✨ Top Up Diamonds" },
      { id: "ml-5966", amount: "5966 (5009+957) Diamonds", price: 1688713, category: "✨ Top Up Diamonds" },
      { id: "ml-6030", amount: "6030 (5124+906) Diamonds", price: 1688753, category: "✨ Top Up Diamonds" },
      { id: "ml-6012", amount: "6012 (5010+1002) Diamonds", price: 1699695, category: "✨ Top Up Diamonds" },
      { id: "ml-6000", amount: "6000 (5000+1000) Diamonds", price: 1789352, category: "✨ Top Up Diamonds" },
      { id: "ml-7727", amount: "7727 (6509+1218) Diamonds", price: 1839170, category: "✨ Top Up Diamonds" },
      { id: "ml-6840", amount: "6840 (5711+1129) Diamonds", price: 1913765, category: "✨ Top Up Diamonds" },
      { id: "ml-7210", amount: "7210 (6044+1166) Diamonds", price: 2040197, category: "✨ Top Up Diamonds" },
      { id: "ml-7685", amount: "7685 (6464+1221) Diamonds", price: 2170935, category: "✨ Top Up Diamonds" },
      { id: "ml-7502", amount: "7502 (6252+1250) Diamonds", price: 2180873, category: "✨ Top Up Diamonds" },
      { id: "ml-9288", amount: "9288 (7740+1548) Diamonds", price: 2186441, category: "✨ Top Up Diamonds" },
      { id: "ml-8040", amount: "8040 (6832+1208) Diamonds", price: 2251670, category: "✨ Top Up Diamonds" },
      { id: "ml-8850", amount: "8850 (7419+1431) Diamonds", price: 2476682, category: "✨ Top Up Diamonds" },
      { id: "ml-9660", amount: "9660 (8006+1654) Diamonds", price: 2701695, category: "✨ Top Up Diamonds" },
      { id: "ml-10050", amount: "10050 (8540+1510) Diamonds", price: 2814587, category: "✨ Top Up Diamonds" },
      { id: "ml-12976", amount: "12976 (10839+2137) Diamonds", price: 3058116, category: "✨ Top Up Diamonds" },
      { id: "ml-14820", amount: "14820 (12389+2431) Diamonds", price: 3503113, category: "✨ Top Up Diamonds" },
      { id: "ml-14490", amount: "14490 (12009+2481) Diamonds", price: 4052542, category: "✨ Top Up Diamonds" },
      { id: "ml-18576", amount: "18576 (15480+3096) Diamonds", price: 4372881, category: "✨ Top Up Diamonds" },
      { id: "ml-16080", amount: "16080 (13664+2416) Diamonds", price: 4503339, category: "✨ Top Up Diamonds" },
      { id: "ml-20100", amount: "20100 (17080+3020) Diamonds", price: 5629174, category: "✨ Top Up Diamonds" },
      { id: "ml-27864", amount: "27864 (23220+4644) Diamonds", price: 6559321, category: "✨ Top Up Diamonds" }
    ]
  },

  /* =======================================================
     FREE FIRE
     ======================================================= */
  {
    id: "free-fire",
    slug: "free-fire",
    name: "Free Fire",
    image: "assets/icons/free-fire.webp",
    icon: "🔥",
    publisher: "Garena",

    denominations: [
      { id: "ff-membership-weekly", amount: "Member Mingguan", price: 30067, category: "Membership" },
      { id: "ff-bp-card", amount: "BP Card", price: 45071, category: "Membership" },
      { id: "ff-membership-monthly", amount: "Member Bulanan", price: 90130, category: "Membership" },
      { id: "ff-5", amount: "5 Diamonds", price: 976, category: "✨ Top Up Instant" },
      { id: "ff-12", amount: "12 Diamonds", price: 1951, category: "✨ Top Up Instant" },
      { id: "ff-15", amount: "15 Diamonds", price: 2928, category: "✨ Top Up Instant" },
      { id: "ff-20", amount: "20 Diamonds", price: 3904, category: "✨ Top Up Instant" },
      { id: "ff-25", amount: "25 Diamonds", price: 4880, category: "✨ Top Up Instant" },
      { id: "ff-30", amount: "30 Diamonds", price: 5856, category: "✨ Top Up Instant" },
      { id: "ff-50", amount: "50 Diamonds", price: 7802, category: "✨ Top Up Instant" },
      { id: "ff-55", amount: "55 Diamonds", price: 8778, category: "✨ Top Up Instant" },
      { id: "ff-70", amount: "70 Diamonds", price: 9752, category: "✨ Top Up Instant" },
      { id: "ff-75", amount: "75 Diamonds", price: 10728, category: "✨ Top Up Instant" },
      { id: "ff-80", amount: "80 Diamonds", price: 11704, category: "✨ Top Up Instant" },
      { id: "ff-90", amount: "90 Diamonds", price: 13656, category: "✨ Top Up Instant" },
      { id: "ff-95", amount: "95 Diamonds", price: 14632, category: "✨ Top Up Instant" },
      { id: "ff-100", amount: "100 Diamonds", price: 15608, category: "✨ Top Up Instant" },
      { id: "ff-120", amount: "120 Diamonds", price: 17554, category: "✨ Top Up Instant" },
      { id: "ff-140", amount: "140 Diamonds", price: 19503, category: "✨ Top Up Instant" },
      { id: "ff-145", amount: "145 Diamonds", price: 20479, category: "✨ Top Up Instant" },
      { id: "ff-160", amount: "160 Diamonds", price: 23407, category: "✨ Top Up Instant" },
      { id: "ff-170", amount: "170 Diamonds", price: 25358, category: "✨ Top Up Instant" },
      { id: "ff-190", amount: "190 Diamonds", price: 27306, category: "✨ Top Up Instant" },
      { id: "ff-180", amount: "180 Diamonds", price: 27310, category: "✨ Top Up Instant" },
      { id: "ff-210", amount: "210 Diamonds", price: 29255, category: "✨ Top Up Instant" },
      { id: "ff-260", amount: "260 Diamonds", price: 37057, category: "✨ Top Up Instant" },
      { id: "ff-250", amount: "250 Diamonds", price: 37062, category: "✨ Top Up Instant" },
      { id: "ff-280", amount: "280 Diamonds", price: 39006, category: "✨ Top Up Instant" },
      { id: "ff-300", amount: "300 Diamonds", price: 42910, category: "✨ Top Up Instant" },
      { id: "ff-355", amount: "355 Diamonds", price: 48757, category: "✨ Top Up Instant" },
      { id: "ff-360", amount: "360 Diamonds", price: 49733, category: "✨ Top Up Instant" },
      { id: "ff-375", amount: "375 Diamonds", price: 52661, category: "✨ Top Up Instant" },
      { id: "ff-405", amount: "405 Diamonds", price: 56555, category: "✨ Top Up Instant" },
      { id: "ff-425", amount: "425 Diamonds", price: 58509, category: "✨ Top Up Instant" },
      { id: "ff-475", amount: "475 Diamonds", price: 66311, category: "✨ Top Up Instant" },
      { id: "ff-495", amount: "495 Diamonds", price: 68260, category: "✨ Top Up Instant" },
      { id: "ff-500", amount: "500 Diamonds", price: 69236, category: "✨ Top Up Instant" },
      { id: "ff-512", amount: "512 Diamonds", price: 71187, category: "✨ Top Up Instant" },
      { id: "ff-520", amount: "520 Diamonds", price: 73139, category: "✨ Top Up Instant" },
      { id: "ff-545", amount: "545 Diamonds", price: 76061, category: "✨ Top Up Instant" },
      { id: "ff-565", amount: "565 Diamonds", price: 78012, category: "✨ Top Up Instant" },
      { id: "ff-600", amount: "600 Diamonds", price: 84843, category: "✨ Top Up Instant" },
      { id: "ff-635", amount: "635 Diamonds", price: 87763, category: "✨ Top Up Instant" },
      { id: "ff-645", amount: "645 Diamonds", price: 89715, category: "✨ Top Up Instant" },
      { id: "ff-655", amount: "655 Diamonds", price: 91666, category: "✨ Top Up Instant" },
      { id: "ff-720", amount: "720 Diamonds", price: 97514, category: "✨ Top Up Instant" },
      { id: "ff-725", amount: "725 Diamonds", price: 98490, category: "✨ Top Up Instant" },
      { id: "ff-740", amount: "740 Diamonds", price: 101417, category: "✨ Top Up Instant" },
      { id: "ff-770", amount: "770 Diamonds", price: 105315, category: "✨ Top Up Instant" },
      { id: "ff-790", amount: "790 Diamonds", price: 107266, category: "✨ Top Up Instant" },
      { id: "ff-800", amount: "800 Diamonds", price: 109218, category: "✨ Top Up Instant" },
      { id: "ff-860", amount: "860 Diamonds", price: 117017, category: "✨ Top Up Instant" },
      { id: "ff-930", amount: "930 Diamonds", price: 126769, category: "✨ Top Up Instant" },
      { id: "ff-1000", amount: "1000 Diamonds", price: 136520, category: "✨ Top Up Instant" },
      { id: "ff-1050", amount: "1050 Diamonds", price: 144321, category: "✨ Top Up Instant" },
      { id: "ff-1075", amount: "1075 Diamonds", price: 146271, category: "✨ Top Up Instant" },
      { id: "ff-1080", amount: "1080 Diamonds", price: 147246, category: "✨ Top Up Instant" },
      { id: "ff-1200", amount: "1200 Diamonds", price: 164800, category: "✨ Top Up Instant" },
      { id: "ff-1215", amount: "1215 Diamonds", price: 165773, category: "✨ Top Up Instant" },
      { id: "ff-1300", amount: "1300 Diamonds", price: 178453, category: "✨ Top Up Instant" },
      { id: "ff-1450", amount: "1450 Diamonds", price: 195026, category: "✨ Top Up Instant" },
      { id: "ff-1440", amount: "1440 Diamonds", price: 195027, category: "✨ Top Up Instant" },
      { id: "ff-1490", amount: "1490 Diamonds", price: 202833, category: "✨ Top Up Instant" },
      { id: "ff-1510", amount: "1510 Diamonds", price: 204779, category: "✨ Top Up Instant" },
      { id: "ff-1580", amount: "1580 Diamonds", price: 214531, category: "✨ Top Up Instant" },
      { id: "ff-1800", amount: "1800 Diamonds", price: 245737, category: "✨ Top Up Instant" },
      { id: "ff-1875", amount: "1875 Diamonds", price: 253535, category: "✨ Top Up Instant" },
      { id: "ff-1975", amount: "1975 Diamonds", price: 269141, category: "✨ Top Up Instant" },
      { id: "ff-2005", amount: "2005 Diamonds", price: 273039, category: "✨ Top Up Instant" },
      { id: "ff-2020", amount: "2020 Diamonds", price: 275966, category: "✨ Top Up Instant" },
      { id: "ff-2100", amount: "2100 Diamonds", price: 285716, category: "✨ Top Up Instant" },
      { id: "ff-2180", amount: "2180 Diamonds", price: 292540, category: "✨ Top Up Instant" },
      { id: "ff-2160", amount: "2160 Diamonds", price: 292540, category: "✨ Top Up Instant" },
      { id: "ff-2200", amount: "2200 Diamonds", price: 296443, category: "✨ Top Up Instant" },
      { id: "ff-2210", amount: "2210 Diamonds", price: 298395, category: "✨ Top Up Instant" },
      { id: "ff-2225", amount: "2225 Diamonds", price: 301322, category: "✨ Top Up Instant" },
      { id: "ff-2280", amount: "2280 Diamonds", price: 308147, category: "✨ Top Up Instant" },
      { id: "ff-2350", amount: "2350 Diamonds", price: 317897, category: "✨ Top Up Instant" },
      { id: "ff-2355", amount: "2355 Diamonds", price: 318873, category: "✨ Top Up Instant" },
      { id: "ff-2400", amount: "2400 Diamonds", price: 323746, category: "✨ Top Up Instant" },
      { id: "ff-2575", amount: "2575 Diamonds", price: 349103, category: "✨ Top Up Instant" },
      { id: "ff-2720", amount: "2720 Diamonds", price: 369582, category: "✨ Top Up Instant" },
      { id: "ff-2750", amount: "2750 Diamonds", price: 371527, category: "✨ Top Up Instant" },
      { id: "ff-3000", amount: "3000 Diamonds", price: 405660, category: "✨ Top Up Instant" },
      { id: "ff-3310", amount: "3310 Diamonds", price: 447587, category: "✨ Top Up Instant" },
      { id: "ff-3640", amount: "3640 Diamonds", price: 487565, category: "✨ Top Up Instant" },
      { id: "ff-3675", amount: "3675 Diamonds", price: 494396, category: "✨ Top Up Instant" },
      { id: "ff-3800", amount: "3800 Diamonds", price: 510972, category: "✨ Top Up Instant" },
      { id: "ff-4000", amount: "4000 Diamonds", price: 537298, category: "✨ Top Up Instant" },
      { id: "ff-4050", amount: "4050 Diamonds", price: 545099, category: "✨ Top Up Instant" },
      { id: "ff-4340", amount: "4340 Diamonds", price: 586057, category: "✨ Top Up Instant" },
      { id: "ff-4450", amount: "4450 Diamonds", price: 598734, category: "✨ Top Up Instant" },
      { id: "ff-4720", amount: "4720 Diamonds", price: 634811, category: "✨ Top Up Instant" },
      { id: "ff-4800", amount: "4800 Diamonds", price: 648468, category: "✨ Top Up Instant" },
      { id: "ff-4850", amount: "4850 Diamonds", price: 656269, category: "✨ Top Up Instant" },
      { id: "ff-5500", amount: "5500 Diamonds", price: 740125, category: "✨ Top Up Instant" },
      { id: "ff-5600", amount: "5600 Diamonds", price: 753778, category: "✨ Top Up Instant" },
      { id: "ff-6000", amount: "6000 Diamonds", price: 807409, category: "✨ Top Up Instant" },
      { id: "ff-6480", amount: "6480 Diamonds", price: 872748, category: "✨ Top Up Instant" },
      { id: "ff-6550", amount: "6550 Diamonds", price: 879569, category: "✨ Top Up Instant" },
      { id: "ff-6900", amount: "6900 Diamonds", price: 927350, category: "✨ Top Up Instant" },
      { id: "ff-7290", amount: "7290 Diamonds", price: 975129, category: "✨ Top Up Instant" },
      { id: "ff-7295", amount: "7295 Diamonds", price: 976105, category: "✨ Top Up Instant" },
      { id: "ff-7310", amount: "7310 Diamonds", price: 979032, category: "✨ Top Up Instant" },
      { id: "ff-7340", amount: "7340 Diamonds", price: 982930, category: "✨ Top Up Instant" },
      { id: "ff-7360", amount: "7360 Diamonds", price: 984881, category: "✨ Top Up Instant" },
      { id: "ff-7430", amount: "7430 Diamonds", price: 994632, category: "✨ Top Up Instant" },
      { id: "ff-7645", amount: "7645 Diamonds", price: 1023886, category: "✨ Top Up Instant" },
      { id: "ff-7650", amount: "7650 Diamonds", price: 1024861, category: "✨ Top Up Instant" },
      { id: "ff-8010", amount: "8010 Diamonds", price: 1072642, category: "✨ Top Up Instant" },
      { id: "ff-9290", amount: "9290 Diamonds", price: 1249144, category: "✨ Top Up Instant" },
      { id: "ff-9800", amount: "9800 Diamonds", price: 1314475, category: "✨ Top Up Instant" },
      { id: "ff-14580", amount: "14580 Diamonds", price: 1950257, category: "✨ Top Up Instant" },
      { id: "ff-36500", amount: "36500 Diamonds", price: 4875643, category: "✨ Top Up Instant" },
      { id: "ff-37050", amount: "37050 Diamonds", price: 4952680, category: "✨ Top Up Instant" },
      { id: "ff-73100", amount: "73100 Diamonds", price: 9751285, category: "✨ Top Up Instant" }
    ]
  },

  /* =======================================================
     ROBLOX VIA LOGIN
     ======================================================= */
  {
    id: "roblox-via-login",
    slug: "roblox-via-login",
    name: "Roblox Via Login",
    image: "assets/icons/roblox.webp",
    icon: "🎮",
    publisher: "Roblox Corporation",

    denominations: [
      { id: "rbl-login-80", amount: "80 Robux", price: 15587, category: "Paket Special" },
      { id: "rbl-login-160", amount: "160 Robux", price: 31174, category: "Paket Special" },
      { id: "rbl-login-240", amount: "240 Robux", price: 46761, category: "Paket Special" },
      { id: "rbl-login-320", amount: "320 Robux", price: 62348, category: "Paket Special" },
      { id: "rbl-login-500", amount: "500 Robux", price: 77935, category: "Paket Normal" },
      { id: "rbl-login-580", amount: "580 Robux", price: 93522, category: "Paket Normal" },
      { id: "rbl-login-660", amount: "660 Robux", price: 109109, category: "Paket Normal" },
      { id: "rbl-login-740", amount: "740 Robux", price: 124696, category: "Paket Normal" },
      { id: "rbl-login-820", amount: "820 Robux", price: 140283, category: "Paket Normal" },
      { id: "rbl-login-1000", amount: "1000 Robux", price: 155870, category: "Paket Normal" },
      { id: "rbl-login-1500", amount: "1500 Robux", price: 233805, category: "Paket Normal" },
      { id: "rbl-login-2000", amount: "2000 Robux", price: 311740, category: "Paket Normal" },
      { id: "rbl-login-2500", amount: "2500 Robux", price: 389675, category: "Paket Normal" },
      { id: "rbl-login-3500", amount: "3500 Robux", price: 545545, category: "Paket Normal" },
      { id: "rbl-login-3000", amount: "3000 Robux", price: 467610, category: "Paket Juragan" },
      { id: "rbl-login-4000", amount: "4000 Robux", price: 623480, category: "Paket Juragan" },
      { id: "rbl-login-5000", amount: "5000 Robux", price: 779350, category: "Paket Juragan" },
      { id: "rbl-login-8000", amount: "8000 Robux", price: 1246960, category: "Paket Juragan" },
      { id: "rbl-login-10000", amount: "10000 Robux", price: 1558700, category: "Paket Juragan" },
      { id: "rbl-login-15000", amount: "15000 Robux", price: 2338050, category: "Paket Juragan" },
      { id: "rbl-login-22000", amount: "22000 Robux", price: 3429140, category: "Paket Juragan" },
      { id: "rbl-login-44000", amount: "44000 Robux", price: 6858280, category: "Paket Juragan" }
    ]
  },

  /* =======================================================
     ROBLOX VIA USERNAME
     ======================================================= */
  {
    id: "roblox-via-username",
    slug: "roblox-via-username",
    name: "Roblox Via Username",
    image: "assets/icons/roblox.webp",
    icon: "🎮",
    publisher: "Roblox Corporation",

    denominations: [
      { id: "rbl-user-40", amount: "40 Robux (Wajib 18+ & Aktif V2L)", price: 8500, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-80", amount: "80 Robux (Wajib 18+ & Aktif V2L)", price: 16000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-160", amount: "160 Robux (Wajib 18+ & Aktif V2L)", price: 32000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-240", amount: "240 Robux (Wajib 18+ & Aktif V2L)", price: 48000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-320", amount: "320 Robux (Wajib 18+ & Aktif V2L)", price: 64000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-400", amount: "400 Robux (Wajib 18+ & Aktif V2L)", price: 80000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-500", amount: "500 Robux (Wajib 18+ & Aktif V2L)", price: 85000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-1000", amount: "1000 Robux (Wajib 18+ & Aktif V2L)", price: 170000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-1500", amount: "1500 Robux (Wajib 18+ & Aktif V2L)", price: 255000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-2000", amount: "2000 Robux (Wajib 18+ & Aktif V2L)", price: 340000, category: "Robux", logo: "assets/icons/robux.webp" }
    ]
  },

  /* =======================================================
     PUBG MOBILE
     ======================================================= */
  {
    id: "pubg-mobile",
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    image: "assets/icons/pubg-mobile.webp",
    icon: "🎯",
    publisher: "Level Infinite",

    denominations: [
      { id: "pubg-60", amount: "60 UC", shortAmount: "60 UC", name: "PUBG Mobile - 60 UC", price: 16999, category: "⚡ UC Global" },
      { id: "pubg-325", amount: "325 (300+25) UC", shortAmount: "325 (300+25) UC", name: "PUBG Mobile - 325 (300+25) UC", price: 84999, category: "⚡ UC Global" },
      { id: "pubg-660", amount: "660 (600+60) UC", shortAmount: "660 (600+60) UC", name: "PUBG Mobile - 660 (600+60) UC", price: 168999, category: "⚡ UC Global" },
      { id: "pubg-1800", amount: "1800 (1500+300) UC", shortAmount: "1800 (1500+300) UC", name: "PUBG Mobile - 1800 (1500+300) UC", price: 422999, category: "⚡ UC Global" },
      { id: "pubg-3850", amount: "3850 (3000+850) UC", shortAmount: "3850 (3000+850) UC", name: "PUBG Mobile - 3850 (3000+850) UC", price: 845999, category: "⚡ UC Global" },
      { id: "pubg-8100", amount: "8100 (6000+2100) UC", shortAmount: "8100 (6000+2100) UC", name: "PUBG Mobile - 8100 (6000+2100) UC", price: 1691999, category: "⚡ UC Global" }
    ]
  }
];


/* =========================================================
   GLOBAL
   ========================================================= */

window.PRODUCTS = PRODUCTS;


/* =========================================================
   GET PRODUCTS
   ========================================================= */

function getProducts() {
  return PRODUCTS;
}


/* =========================================================
   GET PRODUCT
   ========================================================= */

function getProductById(id) {
  return PRODUCTS.find(product =>
    String(product.id) === String(id) ||
    String(product.slug) === String(id)
  );
}


/* =========================================================
   GET DENOMINATION
   ========================================================= */

function getDenomination(productId, denominationId) {
  const product = getProductById(productId);

  if (!product) {
    return null;
  }

  return product.denominations.find(item =>
    String(item.id) === String(denominationId) ||
    String(item.amount) === String(denominationId)
  ) || null;
}


/* =========================================================
   CHEAPEST DENOMINATION
   ========================================================= */

function getCheapestDenomination(productId) {
  const product = getProductById(productId);

  if (
    !product ||
    !Array.isArray(product.denominations) ||
    product.denominations.length === 0
  ) {
    return null;
  }

  return product.denominations.reduce(
    (cheapest, current) => {
      if (!cheapest) return current;

      return Number(current.price || 0) <
        Number(cheapest.price || 0)
        ? current
        : cheapest;
    },
    null
  );
}


/* =========================================================
   FORMAT RUPIAH
   ========================================================= */

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}


/* =========================================================
   SEARCH PRODUCTS
   ========================================================= */

function searchProducts(keyword = "") {
  const query = String(keyword)
    .trim()
    .toLowerCase();

  if (!query) {
    return PRODUCTS;
  }

  return PRODUCTS.filter(product => {
    const name = String(product.name || "").toLowerCase();
    const id = String(product.id || "").toLowerCase();
    const slug = String(product.slug || "").toLowerCase();
    const publisher = String(product.publisher || "").toLowerCase();

    return (
      name.includes(query) ||
      id.includes(query) ||
      slug.includes(query) ||
      publisher.includes(query)
    );
  });
}


/* =========================================================
   GLOBAL HELPERS
   ========================================================= */

window.getProducts = getProducts;
window.getProductById = getProductById;
window.getDenomination = getDenomination;
window.getCheapestDenomination = getCheapestDenomination;
window.formatRupiah = formatRupiah;
window.searchProducts = searchProducts;

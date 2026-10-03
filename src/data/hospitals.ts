export interface Hospital {
  name: string
  network: 'smile' | 'other' | 'clinic' | 'telemedicine'
  region: string
  province: string
  address: string
  phone: string
  services: string[]
  insuranceTypes: string[]
  isGovernment: boolean
  lat: number
  lng: number
}

export const regions = [
  'กรุงเทพและปริมณฑล',
  'ภาคกลางและตะวันออก',
  'ภาคเหนือ',
  'ภาคตะวันออกเฉียงเหนือ',
  'ภาคใต้',
] as const

export type Region = typeof regions[number]

export const serviceLabels: Record<string, string> = {
  OPD: 'ผู้ป่วยนอก',
  IPD: 'ผู้ป่วยใน',
  daySurgery: 'การผ่าตัดแบบไม่ต้องนอน รพ.',
  dental: 'ทันตกรรม',
}

export const networkLabels: Record<Hospital['network'], string> = {
  smile: 'MTL Smile Hospital Network',
  other: 'โรงพยาบาลอื่น ๆ',
  clinic: 'คลินิก',
  telemedicine: 'บริการแพทย์ทางไกล',
}

export const hospitals: Hospital[] = [
  { name: 'กรุงเทพ', network: 'smile', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '2 ซ.ศูนย์วิจัย 7 ถนน เพชรบุรีตัดใหม่ เขตห้วยขวาง กรุงเทพฯ 10310', phone: '02-310-3000', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 13.7535, lng: 100.5625 },
  { name: 'กรุงเทพเชียงใหม่', network: 'smile', region: 'ภาคเหนือ', province: 'เชียงใหม่', address: '88/8 หมู่ 6 ถนน ซุปเปอร์ไฮย์เวย์ ตำบล หนองป่าครั่ง อำเภอ เมืองเชียงใหม่ จังหวัด เชียงใหม่ 50000', phone: '052-089-888', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 18.8132, lng: 99.0154 },
  { name: 'กรุงเทพเชียงราย', network: 'smile', region: 'ภาคเหนือ', province: 'เชียงราย', address: '369 หมู่ที่ 13 ถนน พหลโยธิน ตำบล นางแล อำเภอ เมืองเชียงราย จังหวัด เชียงราย 57100', phone: '052-051-800', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 19.9105, lng: 99.8406 },
  { name: 'กรุงเทพขอนแก่น', network: 'smile', region: 'ภาคตะวันออกเฉียงเหนือ', province: 'ขอนแก่น', address: '888 หมู่ 16 ถนน มะลิวัลย์ ตำบล ในเมือง อำเภอ เมืองขอนแก่น จังหวัด ขอนแก่น 40000', phone: '043-042-888', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 16.4419, lng: 102.8360 },
  { name: 'กรุงเทพพัทยา', network: 'smile', region: 'ภาคกลางและตะวันออก', province: 'ชลบุรี', address: '301 หมู่ 6 ถนน สุขุมวิท ตำบล นาเกลือ อำเภอ บางละมุง จังหวัด ชลบุรี 20150', phone: '038-259-999', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 12.9466, lng: 100.8891 },
  { name: 'กรุงเทพภูเก็ต', network: 'smile', region: 'ภาคใต้', province: 'ภูเก็ต', address: '2/1 ถนน หงษ์หยก ตำบล ตลาดเหนือ อำเภอ เมือง จังหวัด ภูเก็ต 83000', phone: '076-254-421', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 7.8804, lng: 98.3923 },
  { name: 'กรุงเทพจันทบุรี', network: 'smile', region: 'ภาคกลางและตะวันออก', province: 'จันทบุรี', address: '25/14 ถนน ท่าหลวง ตำบล วัดใหม่ อำเภอ เมือง จังหวัด จันทบุรี 22000', phone: '039-319-888', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 12.6095, lng: 102.1045 },
  { name: 'กรุงเทพพิษณุโลก', network: 'smile', region: 'ภาคเหนือ', province: 'พิษณุโลก', address: '91/7 ถนน พิชัยสงคราม ตำบล ในเมือง อำเภอ เมืองพิษณุโลก จังหวัด พิษณุโลก 65000', phone: '055-335-800', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 16.8211, lng: 100.2659 },
  { name: 'กรุงเทพราชสีมา', network: 'smile', region: 'ภาคตะวันออกเฉียงเหนือ', province: 'นครราชสีมา', address: '1308/2 ถนน มิตรภาพ ตำบล ในเมือง อำเภอ เมืองนครราชสีมา จังหวัด นครราชสีมา 30000', phone: '044-429-999', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 14.9798, lng: 102.0975 },
  { name: 'กรุงเทพระยอง', network: 'smile', region: 'ภาคกลางและตะวันออก', province: 'ระยอง', address: '8 ถนน สุขุมวิท ตำบล เนินพระ อำเภอ เมืองระยอง จังหวัด ระยอง 21000', phone: '038-921-999', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 12.6814, lng: 101.2816 },
  { name: 'กรุงเทพสนามจันทร์', network: 'smile', region: 'ภาคกลางและตะวันออก', province: 'นครปฐม', address: '1/1 ถนน ทรงพล ตำบล พระปฐมเจดีย์ อำเภอ เมืองนครปฐม จังหวัด นครปฐม 73000', phone: '034-219-600', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 13.8196, lng: 100.0617 },
  { name: 'กรุงเทพหาดใหญ่', network: 'smile', region: 'ภาคใต้', province: 'สงขลา', address: '75 ซ.15 ถนน เพชรเกษม ตำบล หาดใหญ่ อำเภอ หาดใหญ่ จังหวัด สงขลา 90110', phone: '074-272-800', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 7.0056, lng: 100.4740 },
  { name: 'กรุงเทพอุดร', network: 'smile', region: 'ภาคตะวันออกเฉียงเหนือ', province: 'อุดรธานี', address: '111 ถนน ทหาร ตำบล หมากแข้ง อำเภอ เมืองอุดรธานี จังหวัด อุดรธานี 41000', phone: '042-343-111', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 17.4156, lng: 102.7872 },
  { name: 'กรุงเทพเมืองราช', network: 'smile', region: 'ภาคใต้', province: 'สุราษฎร์ธานี', address: '85/1 ถนน ไชยา ตำบล ตลาด อำเภอ เมือง จังหวัด สุราษฎร์ธานี 84000', phone: '077-273-239', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 9.1406, lng: 99.3313 },
  { name: 'กรุงเทพหัวหิน', network: 'smile', region: 'ภาคกลางและตะวันออก', province: 'ประจวบคีรีขันธ์', address: '888 ถนน เพชรเกษม ตำบล หัวหิน อำเภอ หัวหิน จังหวัด ประจวบคีรีขันธ์ 77110', phone: '032-616-800', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 12.5682, lng: 99.9578 },
  { name: 'กรุงเทพสิริโรจน์', network: 'smile', region: 'ภาคใต้', province: 'สงขลา', address: '93 ถนน ราษฎร์ยินดี ตำบล หาดใหญ่ อำเภอ หาดใหญ่ จังหวัด สงขลา 90110', phone: '074-366-900', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม', 'อุบัติเหตุรายบุคคล', 'อุบัติเหตุรายกลุ่ม'], isGovernment: false, lat: 7.0028, lng: 100.4766 },
  { name: 'บำรุงราษฎร์', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '33 ซ.สุขุมวิท 3 แขวง คลองเตยเหนือ เขต วัฒนา กรุงเทพฯ 10110', phone: '02-066-8888', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7445, lng: 100.5551 },
  { name: 'พญาไท 1', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '364/1 ถนน ศรีอยุธยา แขวง ถนนพญาไท เขต ราชเทวี กรุงเทพฯ 10400', phone: '02-201-4600', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7619, lng: 100.5332 },
  { name: 'พญาไท 2', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '943 ถนน พหลโยธิน แขวง สามเสนใน เขต พญาไท กรุงเทพฯ 10400', phone: '02-270-7000', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7841, lng: 100.5375 },
  { name: 'พญาไท 3', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '111 ถนน เพชรบุรีตัดใหม่ แขวง ทุ่งพญาไท เขต ราชเทวี กรุงเทพฯ 10400', phone: '02-467-1111', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7584, lng: 100.5398 },
  { name: 'สมิติเวช สุขุมวิท', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '133 ซ.สุขุมวิท 49 แขวง คลองตันเหนือ เขต วัฒนา กรุงเทพฯ 10110', phone: '02-022-2222', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7332, lng: 100.5770 },
  { name: 'สมิติเวช ศรีนครินทร์', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '488 ถนน ศรีนครินทร์ แขวง สวนหลวง เขต สวนหลวง กรุงเทพฯ 10250', phone: '02-378-9000', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7186, lng: 100.6340 },
  { name: 'บีเอ็นเอช', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '9/1 ถนน คอนแวนต์ แขวง สีลม เขต บางรัก กรุงเทพฯ 10500', phone: '02-022-0700', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7277, lng: 100.5333 },
  { name: 'ศิริราช ปิยมหาราชการุณย์', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '2 ถนน วังหลัง แขวง ศิริราช เขต บางกอกน้อย กรุงเทพฯ 10700', phone: '02-419-1000', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7597, lng: 100.4855 },
  { name: 'รามาธิบดี', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '270 ถนน พระรามที่ 6 แขวง ทุ่งพญาไท เขต ราชเทวี กรุงเทพฯ 10400', phone: '02-201-1000', services: ['OPD', 'IPD'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: true, lat: 13.7640, lng: 100.5340 },
  { name: 'จุฬาลงกรณ์ สภากาชาดไทย', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '1873 ถนน พระรามที่ 4 แขวง ปทุมวัน เขต ปทุมวัน กรุงเทพฯ 10330', phone: '02-256-4000', services: ['OPD', 'IPD'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: true, lat: 13.7329, lng: 100.5348 },
  { name: 'ศิริราช', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '2 ถนน วังหลัง แขวง ศิริราช เขต บางกอกน้อย กรุงเทพฯ 10700', phone: '02-419-7000', services: ['IPD'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: true, lat: 13.7590, lng: 100.4850 },
  { name: 'พระรามเก้า', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '99 ถนน พระราม 9 แขวง บางกะปิ เขต ห้วยขวาง กรุงเทพฯ 10310', phone: '1270', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7515, lng: 100.5680 },
  { name: 'ธนบุรี', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '34/1 ถนน อิสรภาพ แขวง บ้านช่างหล่อ เขต บางกอกน้อย กรุงเทพฯ 10700', phone: '02-487-2000', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7667, lng: 100.4770 },
  { name: 'ลาดพร้าว', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '2699 ถนน ลาดพร้าว แขวง คลองจั่น เขต บางกะปิ กรุงเทพฯ 10240', phone: '02-530-2556', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7818, lng: 100.6150 },
  { name: 'รามคำแหง', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '436 ถนน รามคำแหง แขวง หัวหมาก เขต บางกะปิ กรุงเทพฯ 10240', phone: '02-743-9999', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7543, lng: 100.6417 },
  { name: 'หัวเฉียว', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '665 ถนน บำรุงเมือง แขวง คลองมหานาค เขต ป้อมปราบศัตรูพ่าย กรุงเทพฯ 10100', phone: '02-223-1351', services: ['OPD', 'IPD'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7500, lng: 100.5100 },
  { name: 'ศิครินทร์', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '19 ซ.ลาซาล ถนน สุขุมวิท 105 แขวง บางนา เขต บางนา กรุงเทพฯ 10260', phone: '02-366-9900', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.6640, lng: 100.6090 },
  { name: 'บางปะกอก 9 อินเตอร์เนชั่นแนล', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '362 ถนน พระราม 2 แขวง บางมด เขต จอมทอง กรุงเทพฯ 10150', phone: '02-877-1111', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.6932, lng: 100.4617 },
  { name: 'พิษณุเวช', network: 'other', region: 'ภาคเหนือ', province: 'พิษณุโลก', address: '858 ถนน มิตรภาพ ตำบล ในเมือง อำเภอ เมืองพิษณุโลก จังหวัด พิษณุโลก 65000', phone: '055-909-000', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 16.8294, lng: 100.2741 },
  { name: 'ราชธานี', network: 'other', region: 'ภาคตะวันออกเฉียงเหนือ', province: 'อุบลราชธานี', address: '99 ถนน เลี่ยงเมือง ตำบล ขามใหญ่ อำเภอ เมืองอุบลราชธานี จังหวัด อุบลราชธานี 34000', phone: '045-280-040', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 15.2286, lng: 104.8564 },
  { name: 'ศรีสวรรค์', network: 'other', region: 'ภาคกลางและตะวันออก', province: 'นครสวรรค์', address: '27/7 ถนน สวรรค์วิถี ตำบล ปากน้ำโพ อำเภอ เมือง จังหวัด นครสวรรค์ 60000', phone: '056-000-333', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 15.6930, lng: 100.1211 },
  { name: 'มหาราชนครเชียงใหม่', network: 'other', region: 'ภาคเหนือ', province: 'เชียงใหม่', address: '110 ถนน อินทวโรรส ตำบล ศรีภูมิ อำเภอ เมืองเชียงใหม่ จังหวัด เชียงใหม่ 50200', phone: '053-936-150', services: ['OPD', 'IPD'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: true, lat: 18.7888, lng: 98.9724 },
  { name: 'มหาราชนครราชสีมา', network: 'other', region: 'ภาคตะวันออกเฉียงเหนือ', province: 'นครราชสีมา', address: '49 ถนน ช้างเผือก ตำบล ในเมือง อำเภอ เมืองนครราชสีมา จังหวัด นครราชสีมา 30000', phone: '044-235-000', services: ['OPD', 'IPD'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: true, lat: 14.9846, lng: 102.1014 },
  { name: 'สงขลานครินทร์', network: 'other', region: 'ภาคใต้', province: 'สงขลา', address: '15 ถนน กาญจนวนิช ตำบล คอหงส์ อำเภอ หาดใหญ่ จังหวัด สงขลา 90110', phone: '074-455-000', services: ['OPD', 'IPD'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: true, lat: 7.0036, lng: 100.5010 },
  { name: 'พุทธชินราช พิษณุโลก', network: 'other', region: 'ภาคเหนือ', province: 'พิษณุโลก', address: '90 ถนน ศรีธรรมไตรปิฎก ตำบล ในเมือง อำเภอ เมืองพิษณุโลก จังหวัด พิษณุโลก 65000', phone: '055-270-300', services: ['OPD', 'IPD'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: true, lat: 16.8267, lng: 100.2566 },
  { name: 'สมิติเวช ชลบุรี', network: 'other', region: 'ภาคกลางและตะวันออก', province: 'ชลบุรี', address: '97/3 หมู่ 3 ถนน สุขุมวิท ตำบล บ้านสวน อำเภอ เมืองชลบุรี จังหวัด ชลบุรี 20000', phone: '038-320-300', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.3622, lng: 100.9847 },
  { name: 'สมิติเวช ศรีราชา', network: 'other', region: 'ภาคกลางและตะวันออก', province: 'ชลบุรี', address: '8 ซ.เจิมจอมพล ถนน เจิมจอมพล ตำบล ศรีราชา อำเภอ ศรีราชา จังหวัด ชลบุรี 20110', phone: '038-320-300', services: ['OPD', 'IPD', 'daySurgery', 'dental'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.1676, lng: 100.9267 },
  { name: 'วิภาราม', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '2677 ถนน พัฒนาการ แขวง พัฒนาการ เขต สวนหลวง กรุงเทพฯ 10250', phone: '02-722-2500', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.7151, lng: 100.6394 },
  { name: 'จุฬารัตน์ 3', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'สมุทรปราการ', address: '90/5 หมู่ 5 ถนน บางนา–ตราด ตำบล บางแก้ว อำเภอ บางพลี จังหวัด สมุทรปราการ 10540', phone: '02-033-2900', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.6155, lng: 100.7240 },
  { name: 'สินแพทย์ รามอินทรา', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'กรุงเทพมหานคร', address: '600 ถนน รามอินทรา แขวง ท่าแร้ง เขต บางเขน กรุงเทพฯ 10230', phone: '02-793-5000', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.8593, lng: 100.6070 },
  { name: 'มหาชัย 2', network: 'other', region: 'กรุงเทพและปริมณฑล', province: 'สมุทรสาคร', address: '222 ถนน เอกชัย ตำบล มหาชัย อำเภอ เมืองสมุทรสาคร จังหวัด สมุทรสาคร 74000', phone: '034-417-100', services: ['OPD', 'IPD', 'daySurgery'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: false, lat: 13.5493, lng: 100.2762 },
  { name: 'กระบี่', network: 'other', region: 'ภาคใต้', province: 'กระบี่', address: '325 ถนน อุตรกิจ ตำบล ปากน้ำ อำเภอ เมือง จังหวัด กระบี่ 81000', phone: '075-623-210', services: ['IPD'], insuranceTypes: ['สุขภาพรายบุคคล', 'สุขภาพรายกลุ่ม'], isGovernment: true, lat: 8.0863, lng: 98.9063 },
]

export const networkStats = {
  totalHospitals: 168,
  smileHospitals: 16,
  otherHospitals: 120,
  clinics: 28,
  telemedicine: 4,
  provinces: 60,
  regions: 5,
}

export function filterHospitals(opts: {
  query?: string
  network?: Hospital['network'] | 'all'
  region?: string
  province?: string
}) {
  let result = hospitals
  if (opts.network && opts.network !== 'all') {
    result = result.filter((h) => h.network === opts.network)
  }
  if (opts.region) {
    result = result.filter((h) => h.region === opts.region)
  }
  if (opts.province) {
    result = result.filter((h) => h.province === opts.province)
  }
  if (opts.query) {
    const q = opts.query.toLowerCase()
    result = result.filter((h) =>
      h.name.toLowerCase().includes(q) ||
      h.province.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q),
    )
  }
  return result
}

export function getProvinces(): string[] {
  return [...new Set(hospitals.map((h) => h.province))].sort()
}

export function getRegionStats() {
  const stats: Record<string, number> = {}
  for (const region of regions) {
    stats[region] = hospitals.filter((h) => h.region === region).length
  }
  return stats
}

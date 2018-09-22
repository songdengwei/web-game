export const API: any = [
  {
    testUrl: '',
    service: 'api',
    test: false,
    interfaces: ['TokenAuth/Authenticate'],
  },
  {
    testUrl: '',
    service: 'api/services/app',
    test: false,
    interfaces: [
      'Supplier/SupplierRegister',
      'Sms/RegSendSms',
      'Upload/UploadFile',
      'Supplier/CreateSupplierBaseInfo',
      'Supplier/QuerySupplierBaseInfo',
      'Sms/SendSMSCode',
      'Supplier/GetCategories',
      'Supplier/CreateOrUpdateBrandCtg',
      'Supplier/QueryBrandCtg',
      'Supplier/QueryAllStatus',
      'Supplier/ActivateAccount',
      'Supplier/UpdateSupplierBaseInfo',
      'Supplier/SendEmailCode',
      'Supplier/QueryAccount',
      'Supplier/SignProtocol',
      'Supplier/PaymentAmount',
      'Supplier/SendRegSms',
      'WebMessageText/GetAllMsg',
      'WebMessageText/ReadMsg',
      'WebMessageText/QueryNoRead',
      'WebMessageText/GetAll',
      'WebMessageText/Create',
      'Supplier/QueryProtocol',
      'Game/GetGameInfo', //获取活动详情  get
      'Game/GetLotteryCount', //获取活动详情 get
      'Game/Lottery', //获取活动详情 get
      'Game/IsAttention', //获取活动详情 get
      'Game/QueryMyPrizes', //我的奖品 post
    ],
  },
];

export const HOST: string = 'http://172.16.0.206:7020';
// window.location.origin.indexOf('localhost') !== -1 ? 'http://172.16.10.51:5003' : window.location.origin; //生产环境

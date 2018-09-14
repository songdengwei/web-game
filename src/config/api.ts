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
    ],
  },
];

export const HOST: string = 'http://172.16.10.51:5003';
  // window.location.origin.indexOf('localhost') !== -1 ? 'http://172.16.10.51:5003' : window.location.origin; //生产环境

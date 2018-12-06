import Eos from 'eosjs';
import ecc from 'eosjs-ecc';
import bip32 from 'bip32';
import $axios from '@/user_conf/axios.conf';

class EosUnit {
  eosConfig = {
    keyProvider: [],
    httpEndpoint: 'https://nodes.get-scatter.com',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    // 如果要广播，需要设为null
    mockTransactions: () => null,
    // transactionHeaders: (expireInSeconds, callback) => {
    //   callback(null/* error */, headers); // 手动设置交易记录头，该方法中的callback回调函数每次交易都会被调用
    // },
    expireInSeconds: 60,
    broadcast: true,
    debug: false,
    sign: true,
    authorization: null
  };
  ecc = ecc;
  eosGet = new Eos(this.eosConfig);
  eosSet = new Eos({
    ...this.eosConfig,
    httpEndpoint: 'http://p2p.meet.one:8888'
  });
  // 检查私钥是否正确
  isValidPrivate = (privateKey) => {
    return this.ecc.isValidPrivate(privateKey);
  };
  // 通过私钥获取账户名/异步函数
  getAccount = (privateKey) => {
    const publickKey = this.ecc.privateToPublic(privateKey);
    return new Promise((resolve) => {
      this.eosGet.getKeyAccounts(publickKey).then((data) => {
        resolve(data.account_names[0]);
      }).catch((err) => {
        console.error(err);
      });
    });
  };
  // 助记词转化为私钥
  wordToPrivate = (words) => {
    const rootSeed = bip32.fromSeed(words);
    const eosPrivate = rootSeed.derivePath('m/194\'/0/0').toWIF();
    return eosPrivate;
  };
  // 获取账户余额
  getAccountNumber = (address) => {
    return (new Promise((resolve, reject) => {
      this.eosGet.getCurrencyBalance('eosio.token', address, 'EOS').then((data) => {
        resolve(data[0].split(' ')[0]);
      });
    }));
  };
  // 获取账户交易记录
  getTransactionLog = (address, page) => {
    return $axios.get('/v1/api/coin/eos_transaction_by_address', {
      params: {
        address,
        page
      }
    });
  };
  // keystore和密码导出eos私钥
  keystoreToPrivatekey = (keystore, pass) => {
    // 获取私钥
    const { btcUnit: { keystoreToPrivatekey } } = require('@/assets/js/btc_func');
    const privateKey = keystoreToPrivatekey(keystore, pass);
    return privateKey;
  };
  // eos转账方法
  transace = ({ keystore, pass, from, to, value, notice }) => {
    return new Promise((resolve, reject) => {
      // 获取私钥
      const privateKey = this.keystoreToPrivatekey(keystore, pass);
      if (!privateKey) reject(new Error('密码输入有误'));
      // 链接eos
      this.eosConfig.keyProvider.push(privateKey);
      const tranEos = new Eos(this.eosConfig);
      // 转账
      tranEos.transfer({
        from: from,
        to: to,
        quantity: (value - 0).toFixed(4) + ' EOS',
        memo: notice
      }).then((data) => {
        resolve('转账交易发送成功,交易ID为:' + data.transaction_id);
      }).catch((err) => {
        const errorMessage = JSON.parse(err).error.details[0].message;
        if (errorMessage.match('cannot transfer to self')) return reject(new Error('不能给自己转账'));
        if (errorMessage.match('overdrawn balance')) return reject(new Error('账户余额不足，请检查'));
        reject(new Error('转账失败，请检查您的转账信息是否正确或账号资源充足'));
      });
    });
  }
};

export const eosUnit = new EosUnit();

import explorers from 'bitcore-explorers';
import bitcore from 'bitcore-lib';
import bip39 from 'bip39';
import bip32 from 'bip32';
import $axios from '@/user_conf/axios.conf';
import oftenFunc from '@/plugins/often_func';

class BtcUnit {
  constructor () {
    this.btcURI = 'https://btc.paytokens.net';
    this.insight = new explorers.Insight(this.btcURI);
    this.bitcore = bitcore;
  };
  // 判断是否是BTC私钥
  isBtcWIF = (privateKey) => {
    try {
      // 尝试使用bitcore处理私钥
      const accountWIF = this.bitcore.PrivateKey.fromWIF(privateKey);
      const account = accountWIF.toWIF().toString();
      if (privateKey.toLocaleLowerCase() === account.toLocaleLowerCase()) {
        // 如果是正确的私钥，返回true
        return true;
      } else {
        return false;
      }
    } catch (err) {
      // 返回错误
      console.error(err);
      return false;
    }
  };
  // 根据私钥返回BTC地址
  backAccount = (privateKey) => {
    const account = this.bitcore.PrivateKey.fromWIF(privateKey);
    return account.toAddress().toString();
  };
  // 助记词字符串转化为buffer
  wordStrToBuffer = (words) => {
    return bip39.mnemonicToSeed(words);
  };
  // 通过助记词生成WIF
  wordToWIF = (words) => {
    // 通过助记词生成WIF对象
    const rootSeed = bip32.fromSeed(words);
    // 通过WIF对象生成WIF字符串
    let wif = rootSeed.derivePath('m/0\'/0/0').toWIF();
    return wif;
  };
  // 检测是否是助记词
  isMnemonic (words) {
    // 检测是否是助记词
    return bip39.validateMnemonic(words);
  };
  // 生成助记词
  createWord () {
    const mnemonic = bip39.generateMnemonic(128, null, bip39.wordlists.english);
    const seed = bip39.mnemonicToSeed(mnemonic);
    return {
      buffer: seed,
      word: mnemonic
    };
  };
  // 获取账户余额的方法
  getAccountNumber = (address) => {
    return new Promise((resolve, reject) => {
      this.insight.requestGet(`/addr/${address}`, function (err, data) {
        if (!err) {
          let btcObj = JSON.parse(data.body);
          btcObj.balance = oftenFunc.numberStrSub(btcObj.balance.toString());
          resolve(btcObj);
        } else {
          reject(new Error('获取失败'));
        }
      });
    });
  };
  // 获取账户交易记录
  getTransactionLog = async (address, page) => {
    return $axios.get('/v1/api/coin/btc_transaction_by_address', {
      params: {
        address,
        page
      }
    });
  };
  // 获取手续费
  getFree = () => {
    return new Promise((resolve, reject) => {
      this.insight.requestGet('/status?q=getInfo', function (err, data) {
        if (err) return reject(new Error('获取手续费失败'));
        resolve(JSON.parse(data.body));
      });
    });
  };
  // keystore和密码导出btc私钥
  keystoreToPrivatekey = (keystore, pass) => {
    const { ethUnit: { keystoreToPritive, Buffer } } = require('@/assets/js/eth_func');
    const privateKey = keystoreToPritive(keystore, pass);
    if (!privateKey) return false;
    const privateBtc = Buffer.from(privateKey.privateKey.substring(2).split(/a+/)).toString();
    return privateBtc;
  };
  // 转账方法
  transace = ({ keystore, pass, from, to, value, free }) => {
    return new Promise((resolve, reject) => {
      // 获取私钥
      const privateKey = this.keystoreToPrivatekey(keystore, pass);
      if (!privateKey) reject(new Error('密码输入有误'));
      // 获取utxo
      this.insight.requestPost('/addrs/utxo', {
        addrs: from
      }, (err, data) => {
        if (err) return reject(new Error('获取账户余额(utxo)失败'));
        if (data.body.length === 0) return reject(new Error('账户余额(utxo)不足'));
        let transaction = null;
        try {
          transaction = new this.bitcore.Transaction()
            .from(data.body)
            .to(to, parseInt(value * 10 ** 8))
            .change(from)
            .fee(free * 10 ** 8)
            .sign(privateKey);
        } catch (err) {
          return reject(new Error('转账信息校验失败，请检查并调整转出信息后重试'));
        }
        // 序列化
        let transactionSerz = '';
        try {
          transactionSerz = transaction.serialize();
        } catch (err) {
          if (err.message.match('different from specified fee')) return reject(new Error('计算总额失败，请调整矿工费后重试'));
          return reject(new Error('转账失败，请检查转账信息后重试'));
        }
        // 发送序列化
        this.insight.requestPost('/tx/send', {
          rawtx: transactionSerz
        }, (err, data) => {
          if (err) return reject(new Error('获取账户余额(utxo)失败'));
          resolve(data.body.txid);
        });
      });
    });
  }
};

export const btcUnit = new BtcUnit();

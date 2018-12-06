import Web3 from 'web3';
import buffer from 'buffer';
// import bip32 from 'bip32';
import hdkey from 'ethereumjs-wallet/hdkey';
import util from 'ethereumjs-util';
import $axios from '@/user_conf/axios.conf';
import oftenFunc from '@/plugins/often_func';

class EthUnit {
  constructor () {
    // 实例化web3
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(
        Web3.givenProvider || 'https://eth.paytokens.net'
      )
    );
    this.Buffer = buffer.Buffer;
  };
  // 将私钥通过pass转化为keystore
  stringToKeystore = (str, pass, typeBuffer) => {
    // typeBuffer是否是buffer字符串加密
    if (!typeBuffer && !str.match(/0x/)) str = '0x' + str;
    // 通过私钥和密码加密后变成账户对象
    try {
      const walletObj = this.web3.eth.accounts.encrypt(str, pass);
      // 返回对象
      return walletObj;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  // 将keystore和pass转化为私钥
  keystoreToPritive = (keystore, pass) => {
    try {
      const account = this.web3.eth.accounts.decrypt(keystore, pass);
      return account;
    } catch (err) {
      return false;
    }
  };
  // 对字符串改成可以加密的buffer字符串
  toBufferString = (str) => {
    // 将字符串改成buffer格式后转成buffer字符串
    let newBuffer = this.Buffer.from(str).toJSON().data.join('a');
    // 判断buffer字符串长度是否是偶数，如果不是，改为偶数
    if (newBuffer.length % 2 !== 0) newBuffer = newBuffer.replace('a', 'aa');
    return newBuffer;
  };
  // 助记词导出私钥
  wordToPrivate = (words) => {
    var hdWallet = hdkey.fromMasterSeed(words);
    var accountKey = hdWallet.derivePath('m/44\'/0\'/0\'/0/0');
    var privateKey = util.bufferToHex(accountKey.getWallet()._privKey);
    return privateKey;
  };
  // 地址添加0x
  addHexPrefix (address) {
    return util.addHexPrefix(address);
  };
  // 获取余额
  getAccountNumber = (address) => {
    return new Promise((resolve) => {
      this.web3.eth.getBalance(address).then((data) => {
        const dataStr = this.web3.utils.fromWei(data);
        resolve(oftenFunc.numberStrSub(dataStr));
      });
    });
  };
  // 获取交易记录
  getTransactionLog = (address, page) => {
    return $axios.get('/v1/api/coin/eth_transaction_by_address', {
      params: {
        address,
        page
      }
    }).then(({ data }) => {
      return data.data.map(item => {
        let message = '';
        try {
          message = this.web3.utils.hexToUtf8(item.message);
        } catch (err) {
          message = this.web3.utils.hexToAscii(item.message);
        }
        return {
          type: item.type,
          value: (item.type === 'out' ? '-' : '') + this.web3.utils.fromWei(item.value),
          time: item.time,
          message: message,
          finish: item.confirmations >= 12,
          hash: item.hash,
          proto: {
            ...item,
            value: this.web3.utils.fromWei(item.value),
            message,
            fees: this.web3.utils.fromWei(item.fees.toString())
          }
        };
      });
    });
  };
  // 获取代币交易记录
  getContractLog = ({ contractAddress, address }) => {
    return new Promise((resolve, reject) => {
      const axios = require('axios');
      axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'tokentx',
          contractaddress: contractAddress,
          address: address,
          startblock: '0',
          endblock: '99999999',
          sort: 'asc',
          apikey: 'YourApiKeyToken'
        }
      }).then(({ data }) => {
        resolve(data.result);
      }).catch((err) => {
        reject(err);
      });
    });
  };
  // keystore和密码导出eth私钥
  keystoreToPrivatekey = (keystore, pass, getObj = false) => {
    try {
      const privateKey = this.web3.eth.accounts.decrypt(keystore, pass);
      if (getObj) {
        return privateKey;
      } else {
        return privateKey.privateKey;
      }
    } catch (err) {
      return false;
    }
  };
  // 获取手续费
  getFree = () => {
    return this.web3.eth.getGasPrice().then((price) => {
      return this.web3.utils.fromWei(price);
    });
  };
  // 转账方法
  transace = ({ keystore, pass, from, to, value, notice, gasPrice, gasLimet, nonce }) => {
    return new Promise(async (resolve, reject) => {
      // 解锁成私钥
      const privateKey = this.keystoreToPrivatekey(keystore, pass, true);
      if (!privateKey) reject(new Error('输入密码有误，请检查后重试'));
      // 解锁文件
      this.web3.eth.accounts.wallet.add(privateKey.privateKey);
      // ETH
      // 格式化value
      value = new this.web3.utils.BN(this.web3.utils.toWei(parseFloat(value).toString()));
      // 格式化手续费
      gasPrice = new this.web3.utils.BN(this.web3.utils.toWei((gasPrice * 10 ** 18).toString()) / 10 ** 18);
      // 创建交易内容
      let transactionOption = {
        from: from,
        to: to,
        value: value,
        gas: gasLimet,
        gasPrice: gasPrice,
        data: this.web3.utils.utf8ToHex(notice)
      };
      if (nonce !== undefined) {
        transactionOption.nonce = nonce;
      }
      // 签名交易信息
      let signTransaction = null;
      try {
        signTransaction = await privateKey.signTransaction(transactionOption);
      } catch (err) {
        return reject(new Error('转账信息校验失败，请检查并调整转出信息后重试'));
      }
      // 广播信息
      try {
        await this.web3.eth.sendSignedTransaction(signTransaction.rawTransaction)
          .on('transactionHash', (hash) => {
            resolve(hash);
          })
          .on('confirmation', (confirmationNumber) => {
            console.log(confirmationNumber);
          });
      } catch (err) {
        console.log(err);
        if (err.message.match('insufficient funds for gas * price + value')) return reject(new Error('账户余额不足，请检查'));
        if (err.message.match('intrinsic gas too low')) return reject(new Error('手续费过低，请提高后重试'));
        if (err.message.match('known transaction')) return reject(new Error('您有一笔交易正在进行中，请稍后重试'));
        // if (err.message.match('replacement transaction underpriced')) return reject(new Error('您有一笔交易正在等待广播，请提高手续费后重试'));
        if (err.message.match('replacement transaction underpriced')) return reject(new Error('您有一笔交易正在进行中，请稍后重试'));
        if (err.message.match('net_version')) return reject(new Error('当前网络拥堵，请稍后重试'));
        if (err.message.match('price')) return reject(new Error('您的账户资产正等待全网确认中，请在20分钟后重试'));
        reject(err);
      }
    });
  };
  // 获取代币账户余额
  getContractBalance = ({ address, addressToken }) => {
    return new Promise((resolve, reject) => {
      const newContract = new this.web3.eth.Contract(
        require('@/assets/json/interface.json'),
        addressToken
      );
      newContract.methods.balanceOf(address).call({}, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(oftenFunc.numberStrSub(result));
      });
    });
  };
  // 代币转账
  transaceContract = ({ keystore, pass, from, to, value, notice, gasPrice, gasLimet, contractAddress, dec }) => {
    return new Promise((resolve, reject) => {
      if (value.split('.')[1] && value.split('.')[1].length > dec - 0) {
        return resolve(new Error('您输入的金额不正确，小数点后最多保留' + dec + '位'));
      }
      // 解锁成私钥
      const privateKey = this.keystoreToPrivatekey(keystore, pass, true);
      if (!privateKey) reject(new Error('输入密码有误，请检查后重试'));
      // 解锁文件
      this.web3.eth.accounts.wallet.add(privateKey.privateKey);
      // ETH
      // 格式化value
      value = (new this.web3.utils.BN(value * 10 ** (dec - 0))).toString();
      // 格式化手续费
      gasPrice = new this.web3.utils.BN(this.web3.utils.toWei((gasPrice * 10 ** 18).toString()) / 10 ** 18);
      // 创建合约
      let newContract = new this.web3.eth.Contract(require('@/assets/json/interface.json'), contractAddress, {
        from: from
      });
      newContract.methods.transfer(to, value).send({
        from: from,
        gasPrice: gasPrice,
        gas: gasLimet
      }).on('transactionHash', (hash) => {
        console.log(hash);
        resolve(hash);
      }).on('confirmation', (confirmationNumber) => {
        console.log(confirmationNumber);
      }).on('receipt', (receipt) => {
        console.log(receipt);
      }).on('error', (err) => {
        if (err.message.match('insufficient funds for gas * price + value')) return reject(new Error('账户余额不足，请检查'));
        if (err.message.match('intrinsic gas too low')) return reject(new Error('手续费过低，请提高后重试'));
        if (err.message.match('known transaction')) return reject(new Error('您有一笔交易正在进行中，请稍后重试'));
        // if (err.message.match('replacement transaction underpriced')) return reject(new Error('您有一笔交易正在等待广播，请提高手续费后重试'));
        if (err.message.match('replacement transaction underpriced')) return reject(new Error('您有一笔交易正在进行中，请稍后重试'));
        if (err.message.match('net_version')) return reject(new Error('当前网络拥堵，请稍后重试'));
        if (err.message.match('price')) return reject(new Error('您的账户资产正等待全网确认中，请在20分钟后重试'));
        reject(err);
      });
    });
  }
};

export const ethUnit = new EthUnit();

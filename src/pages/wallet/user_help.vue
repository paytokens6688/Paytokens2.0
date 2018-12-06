<template>
  <div id="userHelp">
    <h2 class="title">
      <i class="iconfont icon-iconfontquestion"></i>
      {{ title }}
    </h2>
    <div
      class="content"
      v-html="html">
    </div>
  </div>
</template>

<script>
export default {
  name: 'userHelp',
  layout (context) {
    return 'back_page_img';
  },
  data () {
    return {
      type: this.$route.query.type,
      title: '',
      html: ''
    };
  },
  beforeMount () {
    if (this.type === 'whatWord') {
      // 什么是助记词
      this.title = '什么是助记词？';
      this.html = `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;助记词是明文私钥的另一种表现形式，最早是由 BIP39 提案提出，其目的是为了帮助用户记忆复杂的私钥 (64位的哈希值)。</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;助记词一般由12、15、18、21个单词构成，这些单词都取自一个固定词库，其生成顺序也是按照一定算法而来，所以用户没必要担心随便输入12个单词就会生成一个地址。</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;虽然助记词和 Keystore 都可以作为私钥的另一种表现形式，但与 Keystore 不同的是，助记词是未经加密的私钥，没有任何安全性可言，任何人得到了你的助记词，可以不费吹灰之力的夺走你的资产。所以在用户在备份助记词之后, 一定要注意三点：</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 尽可能采用物理介质备份，例如用笔抄在纸上等， 尽可能不要采用截屏或者拍照之后放在联网的设备里，以防被黑客窃取；</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 多次验证备份的助记词是否正确，一旦抄错一两个单词，那么将对后续找回正确的助记词带来巨大的困难；</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. 将备份后的助记词妥善保管，做好防盗防丢措施。</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PS: 用户可以使用备份的助记词，重新导入 Paytokens，用新的密码生成一个新的 Keystore，用这种方法来修改钱包密码。</p>`;
    } else if (this.type === 'whatPrivate') {
      // 什么是助记词
      this.title = '什么是私钥？';
      this.html = `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们常说，你对钱包中资金的控制取决于相应私钥的所有权和控制权。在区块链交易中, 私钥用于生成支付货币所必须的签名，以证明资金的所有权。私钥必须始终保持机密, 因为一旦泄露给第三方，相当于该私钥保护下的资产也拱手相让了。它不同于Keystore，Keystore 是加密过后的私钥文件，只要密码强度足够强，即使黑客得到 Keystore，破解难度也足够大。</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存储在用户钱包中的私钥完全独立，可由用户的钱包软件生成并管理，无需区块链或者网络连接。用户的钱包地址由公钥经过 keccak256 计算，截取后 40 位 + 0x 得到的。 私钥的样式为 64 位 16 进制的哈希值字符串，例如：56f759ece75f0ab1b783893cbe390288978d4d4ff24dd233245b4285fcc31cf6</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PS：用户可以使用明文私钥导入 Paytokens , 用新的密码生成一个新的 Keystore (记得要将旧的 Keystore 删除), 用这种方法来修改钱包密码。</p>`;
    } else if (this.type === 'whatKeystore') {
      // 什么是助记词
      this.title = '什么是Keystore？';
      this.html = `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Keystore 文件是以太坊钱包存储私钥的一种文件格式 (JSON)。它使用用户自定义密码加密，以起到一定程度上的保护作用, 而保护的程度取决于用户加密该钱包的密码强度, 如果类似于 123456 这样的密码, 是极为不安全的。 在使用 Keystore 时有两点需要注意: 1. 使用不常用, 并且尽可能复杂的密码加密 Keystore 文件; 2. 一定要记住加密 Keystore 的密码, 一旦忘记密码, 那么你就失去了 Keystore 的使用权, 并且Paytokens 无法帮你找回密码, 所以一定要妥善保管好 Keystore 以及密码。</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下面是 keystore 的样式:{"version":3,"id":"b7467fcb-3c8b-41be-bccf-73d43a08c1b7","address":"540f18196da5a533fa36577 a81de55f0a2f4e751","Crypa5to":{"ciphertext":"78ed11b8b6bf29b00f52b42b8542df0e4a 6ac078e626af 7edcf885c3b68154a4","cipherparams":{"iv":"4516579601d96695fe30ace985a9066f"},"cipher":" aes -128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"6276cfda7d40872352c801db5871e5a 33 68a8 d0994cea39ed936760db78d1cdc", "n":1024,"r":8,"p":1},"mac":"d889a5dc609c3f312a41394c c47 640676d2612501a6f8c837ed5559815 8336db"}}g</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PS: Keystore的密码是唯一不可更改的, 如果想更改钱包密码需要使用助记词或明文私钥重新导入钱包, 并使用新密码加密, 生成新的Keystore。。</p>`;
    } else if (this.type === 'whyBuyResouyces') {
      // 为什么要购买资源
      this.title = '为什么购买资源？';
      this.html = '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EOS 资源都包括 RAM (内存), Network BandWidth (网络带宽) 以及 CPU BandWidth (CPU 带宽), 那么用户在使用 EOS 网络的时候, 为什么需要购买资源呢?</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RAM (内存）:</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在 EOS 中, 需要 RAM 来存储数据, 你在 EOS 中进行转账、购买资源、抵押、赎回、投票等操作的时候, 可能需要消耗 RAM (内存), 换句话说, 如果你的 RAM 消耗殆尽, 那么你是无法进行上述基本操作的。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RAM (内存) 必须通过购买方式获得, 这个特点和通过抵押方式获取 CPU 资源以及 NET 资源不太一样。通过购买获得的 EOS RAM 资源可以买卖, 买卖的价格根据市场行情动态调节, 你可通过 https://www.eosrp.io/ 网站查看 RAM/CPU/NET 资源的市场价格, 以求在最优价格时, 进行购买。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当然, 还有值得需要注意的是, 用户在买卖 RAM 资源的时候, 各需要消耗 0.5 % (千分之五) 的手续费, 总共是 1% 的手续费。这笔费用被存在 eosio.ramfee 中, 由 BP 节点进行管理。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注: 当你在使用 Payokens 购买 RAM 时, 因为 RAM 价格随市场价格浮动变化非常快, 所以用户进入购买界面看到的价格, 会和最终购买的价格有出入, 最终购买价格, 要以 EOS 链上取得实时价格为准!</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Network BandWidth (网络带宽):</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;网络带宽取决于过去三天消费的平均值, 作为你下一次执行操作的费率。同样, 如果没有足够的网络带宽资源的话, 你是无法使用 EOS 网络转账等基本功能的。例如, 你每次使用转账功能时, 都会消耗网络带宽资源, 你单位时间内转账的次数越多, 消耗的网络带宽资源越多, 但是带宽资源是可以随着时间的推移, 自动释放。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;与 RAM 资源不同的是, 网络带宽资源是通过抵押的方式获取的, 你可以通过赎回操作, 赎回抵押的带宽资源, 并在三天之后 (72小时后) 收到退款</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CPU BandWidth (CPU 带宽):</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CPU 资源同 NET 资源一样, 取决于过去三天消费的平均值, 作为你下一次执行操作的费率。同样, 如果没有足够的 CPU 带宽资源的话, 你是无法使用 EOS 网络转账等基本功能的。例如, 你每次使用转账功能时, 都会消耗 CPU 带宽资源, 你单位时间内转账的次数越多, 消耗的网络带宽资源越多, 但是带宽资源是可以随着时间的推移, 自动释放。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;与 RAM 资源不同的是, CPU 带宽资源是通过抵押的方式获取的, 你可以通过赎回操作, 赎回抵押的带宽资源, 并在三天之后 (72小时后) 收到退款。</p>';
    }
  }
};
</script>

<style lang="scss">
  #userHelp {
    padding: 0 50px;
    .title {
      color: #fff;
      line-height: 114px;
      font-size: 40px;
      color: #fefefe;
      letter-spacing: 2px;
      .icon-iconfontquestion {
        font-size: 40px;
        padding-right: 10px;
      }
    }
    .content {
      background: #fff;
      height: calc(100% - 114px - 50px);
      border-radius: 10px;
      box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 30px;
      box-sizing: border-box;
      word-wrap: break-word;
      p {
        color: #5e6476;
        font-size: 26px;
        line-height: 50px;
      }
    }
  }
</style>

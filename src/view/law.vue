<template>
  <div class="law_div">
    <div class="container">
      <h2>{{$t('foot.secret')}}</h2>
      <div class="content">
        <p>Privacy Policy</p>
        <p>LHCEX platform privacy policy</p>
        <p>This Privacy Policy explains how LHCEX platform and its Affiliates (“LHCEX”) collects, uses, shares, and protects user information obtained through the lhc114.com website. The terms “we,” “us,” and “our” refer to LHCEX and its affiliates. When we ask for certain personal information from users it is because we are required by law to collect this information or it is relevant for specified purposes. Any non-required information you provide to us is done so voluntarily. You decided whether to provide us with these non-required information; you may not be able to access or utilize all of our Services if you choose not to.</p>
        <p>By using the Site, you consent to the data practices described in this Privacy Policy. On occasion, LHCEX  may revise this Privacy Policy to reflect changes in law or our personal data collection and use practices. If material changes are made to this Privacy Policy, the changes will be announced by posting on the site. We will ask for your consent before using your information for any purpose that is not covered in this Privacy Policy.</p>
        <p>The latest privacy policy has incorporated elements from the General Data Protection Regulation (GDPR) as we act in accordance to its personal information processing rules within the European Economic Area (EEA).</p>
        <p>Information LHCEX Collects</p>
        <p>We want you to understand the types of information we collect when you register for and use LHCEX’s services</p>
        <p>Information you provide to us at registration</p>
        <p>When you create a LHCEX Account, you provide us with personal information that includes your contact information (Email Address, name, and a password). You can also choose to add a phone number for SMS or Google Authenticator account to be used for 2FA verification for improved security.</p>
        <p>Information we collect when authenticating user identity</p>
        <p>To comply with global industry regulatory standards including Anti-Money Laundering (AML), Know-Your-Customer (KYC), and Counter Terrorist Financing (CTF), LHCEX requires user accounts to undergo user identity authentication for both Personal & Enterprise-level accounts. This entails collecting formal identification.</p>
        <p>Information we collect as you use our services</p>
        <p>Service Usage Information</p>
        <p>Through your use of the LHCEX platform, we also monitor and collect tracking information related to usage such as access date & time, device identification, operating system, browser type and IP address. This information may be directly obtained by LHCEX or through third party services. This service usage data helps us our systems to ensure that our interface is accessible for users across all platforms and can aid during criminal investigations.</p>
        <p>Transaction Information</p>
        <p>For all personal and enterprise user accounts, we collect transaction information including deposit snapshots, account balances, trade history, withdrawals, order activity and distribution history. This transaction data is monitored for suspicious trading activity for user fraud protection, and legal case resolution.</p>
        <p>Why does LHCEX Collect this information</p>
        <p>To provide and maintain our services</p>
        <p>We use the information collected to deliver our services and verify user identity. We use the IP address and unique identifiers stored in your device’s cookies to help us authenticate your identity and provide our service. Given our legal obligations and system requirements, we cannot provide you with services without data like identification, contact information and transaction-related information.</p>
        <p>To protect our users</p>
        <p>We use the information collected to protect our platform, users’ accounts and archives. We use IP addresses and cookie data to protect against automated abuse such as spam, phishing and Distributed Denial of Service (DDoS) attacks. We analyse trading activity with the goal of detecting suspicious behavior early to prevent potential fraud and loss of funds to bad actors.</p>
        <p>To comply with legal and regulatory requirements</p>
        <p>Respect for the privacy and security of data you store with LHCEX informs our approach to complying with regulations, governmental requests and user-generated inquiries. We will not disclose or provide any personal information to third party sources without review from our legal case team and/or prior consent from the user.</p>
        <p>To measure site performance</p>
        <p>We actively measure and analyse data to understand how our services are used. This review activity is conducted by our operations team to continually improve our platform’s performance and to resolve issues with the user experience. We continuously monitor our systems’ activity information and communications with users to look for and quickly fix problems.</p>
        <p>To communicate with you</p>
        <p>We use personal information collected, like an email address to interact with users directly when providing customer support on a ticket or to keep you informed on log ins, transations, and security. Without processing your personal information for confirming each communication, we will not be able to respond to your submitted requests, questions and inquiries. All direct communications are kept confidential and reviewed internally for accuracy.</p>
        <p>To enforce our Terms of Use and other agreements</p>
        <p>It is very important for us and our customers that we continually review, investigate and prevent any potentially prohibited or illegal activities that violate our Terms of Service. For the benefit of our entire user base, we carefully enforce our agreements with third parties and actively investigate violations of our posted Terms of Use. LHCEX reserves the right to terminate the provision of service to any user found engaging in activities that violate our Terms of Use.</p>
        <p>How does LHCEX protect user data</p>
        <p>LHCEX has implemented a number of security measures to ensure that your information is not lost, abused, or altered. Our data security measures include, but are not limited to: PCI Scanning, Secured Sockets Layered encryption technology, pseudonymisation, internal data access restrictions, and strict physical access controls to buildings & files. Please note that it is impossible to guarantee 100% secure transmission of data over the Internet nor method of electronic storage. As such, we request that you understand the responsibility to independently take safety precautions to protect your own personal information.</p>
        <p>If you suspect that your personal information has been compromised, especially account and/or password information, please lock your account and contact LHCEX customer service immediately.</p>
        <p>Contact us</p>
        <p>We are committed to respecting the freedoms and rights of all our LHCEX users who have placed their trust in our service. If you should have any questions or concerns regarding this Privacy Policy, or if you would like to file a Data Protection request, please refer to our FAQ and contact us on our Support Page.</p>
        <p>Privacy Policy</p>
        <p>2018-01-19 00:00:00</p>
      </div>
    </div>
    <Foot/>
  </div>
</template>
<script>
import Foot from '@/components/Foot'
import {aboutApi} from '@/api/getData'

export default {
  data() {
    return {
      title: '',
      content: ''
    }
  },
  created() {
    // this.prvacyFun();
  },
  methods: {
    async prvacyFun() {
      var that = this;
      var dataArr = new URLSearchParams();
      dataArr.set('type', 'PRIMARY');
      var res = await aboutApi(dataArr);
      if (res.code == 200) {
        that.content = res.data.content;
      }
    }
  },
  components: {
    Foot,
  }
}
</script>
<style lang="less">
  .law_div {
    h2 {
      font-weight: initial;
      font-size: 28px;
    }
    .content {
      border-top: 1px solid #3B3B3B;
      color: #C3C3C3;
      img {
        max-width: 100%;
      }
    }
  }
</style>

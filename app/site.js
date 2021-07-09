const SiteSettings = require("../model/Site");
const { cloudinary } = require("../utils/cloudinary");

const express = require("express");
const app = express();
app.post("/", async (req, res) => {
  const site = new SiteSettings({
    siteTitle: "Welcome",
  });

  const Site = await site.save();

  res.status(201).json(Site);
});
// @desc    UPDATE  ADMIN MAIL SETTINGS DATA BY ID 604a3fb97cc3a976a1f1a5f7
// @route   PUT /api/site/mailsettings
// @access  Admin
app.put("/mailsettings", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");

  if (siteset) {
    siteset.mailEngine = req.body.mailEngine;
    siteset.SMTPServer = req.body.SMTPServer;
    siteset.SMTPPort = req.body.SMTPPort;
    siteset.SMTPMail = req.body.SMTPMail;
    siteset.SMTPPassword = req.body.SMTPPassword;
    siteset.EmailSenderName = req.body.EmailSenderName;
    siteset.mailForm = req.body.mailForm;
    siteset.emailSendName = req.body.emailSendName;
    siteset.supportMail = req.body.supportMail;
    siteset.supportPhone = req.body.supportPhone;
    siteset.supportAddress = req.body.supportAddress;
    siteset.DPOPhone = req.body.DPOPhone;
    siteset.DPOEmail = req.body.DPOEmail;
    siteset.sendWelcomeMail = req.body.sendWelcomeMail;
    siteset.welcomeMail = req.body.welcomeMail;
    siteset.newUserWelcomeMailTitle = req.body.newUserWelcomeMailTitle;
    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404);
    throw new Error("Site can not be updated");
  }
});

// @desc    SET SITE EMAIL TEMPLATES DATA BY ID 60d6d9f151f2374e57c234ad
// @route   PUT /api/site/mailtemplates
// @access  Admin
app.put("/mailtemplates", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");

  if (siteset) {
    siteset.privacyPolicy = req.body.privacyPolicy;
    siteset.termsOfServices = req.body.termsOfServices;
    siteset.newUserWelcomeMail = req.body.newUserWelcomeMail;
    siteset.activateUserAccountMail = req.body.activateUserAccountMail;
    siteset.adminWithdrawRequestMail = req.body.adminWithdrawRequestMail;
    siteset.confirmWithdrawRequestMail = req.body.confirmWithdrawRequestMail;
    siteset.wthdrawRequestProcessedMail = req.body.wthdrawRequestProcessedMail;
    siteset.userResetPasswordMail = req.body.userResetPasswordMail;
    siteset.userResetPasswordConfirmationMail =
      req.body.userResetPasswordConfirmationMail;
    siteset.userSubscriptionEExpirationMail =
      req.body.userSubscriptionEExpirationMail;
    siteset.userNewIPDetectedMail = req.body.userNewIPDetectedMail;

    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404);
    throw new Error("Site can not be updated");
  }
});

// @desc    SET SITE GENERAL SETTINGS DATA BY ID 60d6d9f151f2374e57c234ad
// @route   PUT /api/site/generalsettings
// @access  Admin
app.put("/generalsettings", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");

  if (siteset) {
    const siteFav = await cloudinary.uploader.upload(req.body.siteFav);
    const siteLogo = await cloudinary.uploader.upload(req.body.siteLogo);
    const siteLogoWhite = await cloudinary.uploader.upload(
      req.body.siteLogoWhite
    );
    siteset.siteFav = siteFav.secure_url;
    siteset.siteLogo = siteLogo.secure_url;
    siteset.siteTitle = req.body.siteTitle;
    siteset.siteLogoWhite = siteLogoWhite.secure_url;
    siteset.privacyPolicyLink = req.body.privacyPolicyLink;
    siteset.termsOfServicesLink = req.body.termsOfServicesLink;
    siteset.useWhiteLogo = req.body.useWhiteLogo;
    siteset.appDescription = req.body.appDescription;
    siteset.maintenanceMode = req.body.maintenanceMode;
    siteset.numberFormat = req.body.numberFormat;
    siteset.currencyPosition = req.body.currencyPosition;
    siteset.switchChartTradingView = req.body.switchChartTradingView;
    siteset.allowUsersswitchView = req.body.allowUsersswitchView;
    siteset.disableChart = req.body.disableChart;
    siteset.enableGoogleAds = req.body.enableGoogleAds;
    siteset.enableCookiePopup = req.body.enableCookiePopup;
    siteset.enableCookiePopupTitle = req.body.enableCookiePopupTitle;
    siteset.enableDonation = req.body.enableDonation;
    siteset.enableAutoLanguage = req.body.enableAutoLanguage;
    siteset.enablePOEEditorLanguage = req.body.enablePOEEditorLanguage;
    siteset.donationAddress = req.body.donationAddress;
    siteset.donationText = req.body.donationText;
    siteset.startWatchUserSignUp = req.body.startWatchUserSignUp;
    siteset.startWatchNewUserSignUp = req.body.startWatchNewUserSignUp;
    siteset.blacklistedCountries = req.body.blacklistedCountries;
    siteset.cookiePopupText = req.body.cookiePopupText;
    siteset.cookiePopupTitle = req.body.cookiePopupTitle;
    siteset.googleSlot = req.body.googleSlot;
    siteset.googleAdClient = req.body.googleAdClient;
    siteset.googleAnalytics = req.body.googleAnalytics;
    siteset.POEditorAPIKeys = req.body.POEditorAPIKeys;
    siteset.POEditorLanguage = req.body.POEditorLanguage;
    siteset.siteLanguage = req.body.siteLanguage;
    siteset.siteStartingCurrencyPair = req.body.siteStartingCurrencyPair;

    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404);
    throw new Error("Site can not be updated");
  }
});

// @desc    SET SITE LOGIN LAYOUT DATA BY ID 60d6d9f151f2374e57c234ad
// @route   PUT /api/site/loginlayout
// @access  Admin
app.put("/loginlayout", async (req, res) => {
  const {
    loginCarouselImage1,
    loginCarouselImage2,
    loginCarouselImage3,
    loginBackgroundImage,
  } = req.body;
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");
  const Image1 = await cloudinary.uploader.upload(loginCarouselImage1);
  const Image2 = await cloudinary.uploader.upload(loginCarouselImage2);
  const Image3 = await cloudinary.uploader.upload(loginCarouselImage3);
  const LoginBackground = await cloudinary.uploader.upload(
    loginBackgroundImage
  );

  if (siteset) {
    siteset.loginBackgroundImage = LoginBackground.secure_url;
    siteset.loginCarouselImage1 = Image1.secure_url;
    siteset.loginCarouselImage2 = Image2.secure_url;
    siteset.loginCarouselImage3 = Image3.secure_url;
    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404).json("Site can not be updated");
  }
});

// @desc    SET SITE LOGIN/SIGNUP APPEARANCE BY ID 60d6d9f151f2374e57c234ad
// @route   PUT /api/site/Appearance
// @access  Admin
app.put("/loginAppearance", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");

  if (siteset) {
    siteset.allowsignup = req.body.allowsignup;
    siteset.phoneNumberRequired = req.body.phoneNumberRequired;
    siteset.userNeedVerifyAccount = req.body.userNeedVerifyAccount;
    siteset.needCaptchaSignup = req.body.needCaptchaSignup;
    siteset.googleRecaptchaSiteKey = req.body.googleRecaptchaSiteKey;
    siteset.googleRecaptchaSiteKeySecret =
      req.body.googleRecaptchaSiteKeySecret;
    siteset.signWithGoogle = req.body.signWithGoogle;
    siteset.googleAppID = req.body.googleAppID;
    siteset.googleAppSecret = req.body.googleAppSecret;
    siteset.authorizationRedirectUrl = req.body.authorizationRedirectUrl;
    siteset.signInFacebook = req.body.signInFacebook;
    siteset.facebookAppId = req.body.facebookAppId;
    siteset.facebookAppSecret = req.body.facebookAppSecret;
    siteset.URIOauthValid = req.body.URIOauthValid;
    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404);
    throw new Error("Site can not be updated");
  }
});

// @desc    SITE LOGIN GENERAL APPEARANCE SETTINGS BY ID 60d6d9f151f2374e57c234ad
// @route   PUT /api/site/generalappearance
// @access  Admin
app.put("/generalappearance", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");

  if (siteset) {
    siteset.yourMainColor = req.body.yourMainColor;
    siteset.siteMenuType = req.body.siteMenuType;
    siteset.showFooterBar = req.body.showFooterBar;
    siteset.defaultThemeColor = req.body.defaultThemeColor;
    siteset.userCanChangeTheme = req.body.userCanChangeTheme;
    siteset.showTimeInFooter = req.body.showTimeInFooter;
    siteset.showContactInFooter = req.body.showContactInFooter;
    siteset.showCalcaulator = req.body.showCalcaulator;
    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404);
    throw new Error("Site can not be updated");
  }
});

// @desc    SITE IDENTITY SETTINGS BY ID 60d6d9f151f2374e57c234ad
// @route   PUT /api/site/siteidentitysettings
// @access  Admin
app.put("/siteidentitysettings", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");

  if (siteset) {
    siteset.enableIdentitySystem = req.body.enableIdentitySystem;
    siteset.blockTradingWithoutIdentity = req.body.blockTradingWithoutIdentity;
    siteset.blockDepositeWithoutIdentityVerification =
      req.body.blockDepositeWithoutIdentityVerification;
    siteset.blockWithdrawWithoutIdentity =
      req.body.blockWithdrawWithoutIdentity;
    siteset.newIdentityWizardTitle = req.body.newIdentityWizardTitle;
    siteset.newIdentityTitle = req.body.newIdentityTitle;
    siteset.newIdentityStartButton = req.body.newIdentityStartButton;
    siteset.identityStepName = req.body.identityStepName;
    siteset.identityStepType = req.body.identityStepType;
    siteset.identityStepDescription = req.body.identityStepDescription;
    siteset.enableIdentityUploadWithWebCam =
      req.body.enableIdentityUploadWithWebCam;
    siteset.webCamDocumentRatio = req.body.webCamDocumentRatio;
    siteset.identityDocumentName = req.body.identityDocumentName;
    siteset.documentIdentityList = req.body.documentIdentityList;
    siteset.newIdentityWizardAdvert = req.body.newIdentityWizardAdvert;

    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404);
    throw new Error("Site can not be updated");
  }
});

// @desc    SITE PAYMENT SETTINGS BY ID 60d6d9f151f2374e57c234ad
// @route   PUT /api/site/paymentsettings
// @access  Admin
app.put("/paymentsettings", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");

  if (siteset) {
    siteset.paymentSuccessText = req.body.paymentSuccessText;
    siteset.paymentRefPattern = req.body.paymentRefPattern;
    siteset.paymentNeedsApproval = req.body.paymentNeedsApproval;
    siteset.masterCardStatus = req.body.masterCardStatus;
    siteset.bitCoinStatus = req.body.bitCoinStatus;
    siteset.btcHeaderText = req.body.btcHeaderText;
    siteset.btcAddress = req.body.btcAddress;
    siteset.buyBTCLink = req.body.buyBTCLink;
    siteset.minWithdrawalAmount = parseInt(req.body.minWithdrawalAmount);
    siteset.maxWithdrawalAmount = parseInt(req.body.maxWithdrawalAmount);
    siteset.minDepositAmount = parseInt(req.body.minDepositAmount);
    siteset.maxDepositAmount = parseInt(req.body.maxDepositAmount);

    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404);
    throw new Error("Site can not be updated");
  }
});
// @desc    SITE PAYMENT METHODS SETTINGS BY ID 60d6d9f151f2374e57c234ad
// @route   PUT /api/site/paymentmethodsettings
// @access  Admin
app.put("/paymentmethodsettings", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");

  if (siteset) {
    siteset.paymentMethods[0] = {
      payWithCard: {
        enableStatus: req.body.enableStatus,
        accountType: req.body.accountType,
        accountName: req.body.accountName,
        paymentAccountNumber: req.body.paymentAccountNumber,
      },
      payWithCryptoCurrency: {
        enableStatus: req.body.enableStatus,
        crytocurrencyType: req.body.crytocurrencyType,
        paymentLink: req.body.paymentLink,
      },
    };
    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404);
    throw new Error("Problems updating payment mehods");
  }
});
// @desc   GET SITE PAYMENT METHODS SETTINGS BY ID 60d6d9f151f2374e57c234ad
// @route   PUT /api/site/paymentmethods
// @access  Public
app.get("/paymentmethods", async (req, res) => {
  const setsite = await SiteSettings.findById("60d6d9f151f2374e57c234ad");
  // 6055eaca8391fb0015ee5cf8
  if (SiteSettings) {
    res.status(200).json(setsite.paymentMethods[0]);
  } else {
    res.status(404);
    throw new Error("Missing Site Parameter");
  }
});

// @desc    GET SITE DATA BY ID 60d6d9f151f2374e57c234ad
// @route   GET /api/site
// @access  Admin
app.get("/", async (req, res) => {
  const setsite = await SiteSettings.findById("60d6d9f151f2374e57c234ad");

  if (SiteSettings) {
    res.status(200).json(setsite);
  } else {
    res.status(404);
    throw new Error("Missing Site Parameter");
  }
});

// @desc    SITE PAYMENT SETTINGS BY ID 60d6d9f151f2374e57c234ad
// @route   PUT /api/site/btcAdminSettings
// @access  Admin
app.put("/btcAdminSettings", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");
  const BTCQRCodeImg = await cloudinary.uploader.upload(req.body.BTCQRCodeImg);
  const depositeImg1 = await cloudinary.uploader.upload(req.body.depositeImg1);
  const depositeImg2 = await cloudinary.uploader.upload(req.body.depositeImg2);
  const depositeImg3 = await cloudinary.uploader.upload(req.body.depositeImg3);

  if (siteset) {
    siteset.paymentSuccessText = req.body.paymentSuccessText;
    siteset.paymentRefPattern = req.body.paymentRefPattern;
    siteset.paymentNeedsApproval = req.body.paymentNeedsApproval;
    siteset.masterCardStatus = req.body.masterCardStatus;
    siteset.bitCoinStatus = req.body.bitCoinStatus;
    siteset.btcHeaderText = req.body.btcHeaderText;
    siteset.btcAddress = req.body.btcAddress;
    siteset.buyBTCLink = req.body.buyBTCLink;
    siteset.BTCAmount1 = req.body.BTCAmount1;
    siteset.BTCAmount2 = req.body.BTCAmount2;
    siteset.BTCAmount3 = req.body.BTCAmount3;
    siteset.depositeImg1 = depositeImg1.secure_url;
    siteset.depositeImg2 = depositeImg2.secure_url;
    siteset.depositeImg3 = depositeImg3.secure_url;
    siteset.BTCQRCodeImg = BTCQRCodeImg.secure_url;
    siteset.depositeImg1Link = req.body.depositeImg1Link;
    siteset.depositeImg2Link = req.body.depositeImg2Link;
    siteset.depositeImg3Link = req.body.depositeImg3Link;

    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404);
    throw new Error("Site can not be updated");
  }
});

// @desc    SITE LIVETRADE SETTINGS BY ID 60d6d9f151f2374e57c234ad
// @route   PATCH /api/site/liveTrade
// @access  Admin
app.patch("/liveTrade", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");
  if (siteset) {
    siteset.liveTrade = req.body.liveTrade;
    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404).send("Site can not be updated");
  }
});

// @desc    SITE LIVETRADE SETTINGS BY ID 60d6d9f151f2374e57c234ad
// @route   GET/api/site/liveTrade
// @access  Admin
app.get("/liveTrade", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");
  if (siteset) {
    res.json(siteset.liveTrade);
  } else {
    res.status(404).send("Site can not be updated");
  }
});

// @desc    SITE DEPOSITE iMAGES SETTINGS BY ID 60d6d9f151f2374e57c234ad
// @route   PUT /api/site/depositImages
// @access  Admin
app.put("/depositImages", async (req, res) => {
  const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");
  const depositeImg1 = await cloudinary.uploader.upload(req.body.depositeImg1);
  const depositeImg2 = await cloudinary.uploader.upload(req.body.depositeImg2);
  const depositeImg3 = await cloudinary.uploader.upload(req.body.depositeImg3);

  if (siteset) {
    siteset.depositeImg1 = depositeImg1.secure_url;
    siteset.depositeImg2 = depositeImg2.secure_url;
    siteset.depositeImg3 = depositeImg3.secure_url;
    siteset.depositeImg1Link = req.body.depositeImg1Link;
    siteset.depositeImg2Link = req.body.depositeImg2Link;
    siteset.depositeImg3Link = req.body.depositeImg3Link;
    await siteset.save();

    res.json(siteset);
  } else {
    res.status(404).send("Site can not be updated");
  }
});

// app.put("/depositMinMax", async (req, res) => {
//   const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");
//   if (siteset) {

//     await siteset.save();
//     res.json(siteset);
//   } else {
//     res.status(404).send("Site can not be updated");
//   }
// });

// app.put("/withdrawalMinMax", async (req, res) => {
//   const siteset = await SiteSettings.findById("60d6d9f151f2374e57c234ad");
//   if (siteset) {

//     await siteset.save();
//     res.json(siteset);
//   } else {
//     res.status(404).send("Site can not be updated");
//   }
// });
module.exports = app;

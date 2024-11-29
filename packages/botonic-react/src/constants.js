import BotonicLogo from './assets/botonic_react_logo100x100.png'
import UrlIcon from './assets/url-icon.png'

export const COLORS = {
  // http://chir.ag/projects/name-that-color
  APPLE_GREEN: 'rgba(58, 156, 53, 1)',
  BLEACHED_CEDAR_PURPLE: 'rgba(46, 32, 59, 1)',
  BOTONIC_BLUE: 'rgba(0, 153, 255, 1)',
  CACTUS_GREEN: 'rgba(96, 115, 94, 1)',
  CONCRETE_WHITE: 'rgba(243, 243, 243, 1)',
  CURIOUS_BLUE: 'rgba(38, 139, 210, 1)',
  DAINTREE_BLUE: 'rgba(0, 43, 53, 1)',
  ERROR_RED: 'rgba(255, 43, 94)',
  FRINGY_FLOWER_GREEN: 'rgba(198, 231, 192, 1)',
  GRAY: 'rgba(129, 129, 129, 1)',
  LIGHT_GRAY: 'rgba(209, 209, 209, 1)',
  MID_GRAY: 'rgba(105, 105, 115, 1)',
  PIGEON_POST_BLUE_ALPHA_0_5: 'rgba(176, 196, 222, 0.5)',
  RED_NOTIFICATIONS: 'rgba(255, 66, 111, 1)',
  SCORPION_GRAY: 'rgba(87, 87, 87, 1)',
  SEASHELL_WHITE: 'rgba(241, 240, 240, 1)',
  SILVER: 'rgba(200, 200, 200, 1)',
  SOLID_BLACK_ALPHA_0_2: 'rgba(0, 0, 0, 0.2)',
  SOLID_BLACK_ALPHA_0_5: 'rgba(0, 0, 0, 0.5)',
  SOLID_BLACK: 'rgba(0, 0, 0, 1)',
  SOLID_WHITE_ALPHA_0_2: 'rgba(255, 255, 255, 0.2)',
  SOLID_WHITE_ALPHA_0_8: 'rgba(255, 255, 255, 0.8)',
  SOLID_WHITE: 'rgba(255, 255, 255, 1)',
  TASMAN_GRAY: 'rgba(209, 216, 207, 1)',
  TRANSPARENT: 'rgba(0, 0, 0, 0)',
  WILD_SAND_WHITE: 'rgba(244, 244, 244, 1)',
}

export const WEBCHAT = {
  DEFAULTS: {
    WIDTH: 300,
    HEIGHT: 450,
    TITLE: 'Botonic',
    LOGO: BotonicLogo,
    URL_ICON: UrlIcon,
    PLACEHOLDER: 'Ask me something...',
    FONT_FAMILY: "'Noto Sans JP', sans-serif",
    BORDER_RADIUS_TOP_CORNERS: '6px 6px 0px 0px',
    ELEMENT_WIDTH: 222,
    ELEMENT_MARGIN_RIGHT: 6,
    STORAGE_KEY: 'botonicState',
    HOST_ID: 'root',
    ID: 'botonic-webchat',
    BUTTON_AUTO_DISABLE: false,
    BUTTON_DISABLED_STYLE: {
      opacity: 0.5,
      cursor: 'auto',
      pointerEvents: 'none',
    },
  },
  CUSTOM_PROPERTIES: {
    // General
    enableAnimations: 'animations.enable',
    markdownStyle: 'markdownStyle',
    imagePreviewer: 'imagePreviewer',
    // Mobile
    mobileBreakpoint: 'mobileBreakpoint',
    mobileStyle: 'mobileStyle',
    // Webviews
    webviewHeaderStyle: 'webview.header.style',
    webviewStyle: 'webview.style',
    // Brand
    brandColor: 'brand.color',
    brandImage: 'brand.image',
    // Header
    customHeader: 'header.custom',
    headerImage: 'header.image',
    headerStyle: 'header.style',
    headerSubtitle: 'header.subtitle',
    headerTitle: 'header.title',
    // Bot Message
    botMessageBackground: 'message.bot.style.background',
    botMessageBlobTick: 'message.bot.blobTick',
    botMessageBlobTickStyle: 'message.bot.blobTickStyle',
    botMessageBlobWidth: 'message.bot.blobWidth',
    botMessageBorderColor: 'message.bot.style.borderColor',
    botMessageImage: 'message.bot.image',
    botMessageImageStyle: 'message.bot.imageStyle',
    botMessageStyle: 'message.bot.style',
    // Agent Message
    agentMessageImage: 'message.agent.image',
    // User Message
    customMessageTypes: 'message.customTypes',
    messageStyle: 'message.style',
    userMessageBackground: 'message.user.style.background',
    userMessageBlobTick: 'message.user.blobTick',
    userMessageBlobTickStyle: 'message.user.blobTickStyle',
    userMessageBorderColor: 'message.user.style.borderColor',
    userMessageStyle: 'message.user.style',
    // Timestamps
    enableMessageTimestamps: 'message.timestamps.enable',
    messageTimestampsFormat: 'message.timestamps.format',
    messageTimestampsStyle: 'message.timestamps.style',
    messageTimestampsWithImage: 'message.timestamps.withImage',
    // Intro
    customIntro: 'intro.custom',
    introImage: 'intro.image',
    introStyle: 'intro.style',
    // Buttons
    buttonHoverBackground: 'button.hoverBackground',
    buttonHoverTextColor: 'button.hoverTextColor',
    buttonMessageType: 'button.messageType',
    buttonStyle: 'button.style',
    buttonDisabledStyle: 'button.disabledstyle',
    buttonAutoDisable: 'button.autodisable',
    buttonStyleBackground: 'button.style.background',
    buttonStyleColor: 'button.style.color',
    customButton: 'button.custom',
    urlIconImage: 'button.urlIcon.image',
    urlIconEnabled: 'button.urlIcon.enable',
    // Replies
    alignReplies: 'replies.align',
    customReply: 'reply.custom',
    replyStyle: 'reply.style',
    wrapReplies: 'replies.wrap',
    // TriggerButton
    customTrigger: 'triggerButton.custom',
    triggerButtonImage: 'triggerButton.image',
    triggerButtonStyle: 'triggerButton.style',
    // Notifications
    notificationsEnabled: 'notifications.enable',
    notificationsBannerEnabled: 'notifications.banner.enable',
    notificationsBannerCustom: 'notifications.banner.custom',
    notificationsBannerText: 'notifications.banner.text',
    notificationsTriggerButtonEnabled: 'notifications.triggerButton.enable',
    // Scroll Button
    scrollButtonEnabled: 'scrollButton.enable',
    scrollButtonCustom: 'scrollButton.custom',
    // User Input
    blockInputs: 'userInput.blockInputs',
    documentDownload: 'documentDownload',
    customMenuButton: 'userInput.menuButton.custom',
    customPersistentMenu: 'userInput.menu.custom',
    customEmojiPicker: 'userInput.emojiPicker.custom',
    customAttachments: 'userInput.attachments.custom',
    customSendButton: 'userInput.sendButton.custom',
    darkBackgroundMenu: 'userInput.menu.darkBackground',
    enableAttachments: 'userInput.attachments.enable',
    enableEmojiPicker: 'userInput.emojiPicker.enable',
    enableSendButton: 'userInput.sendButton.enable',
    enableUserInput: 'userInput.enable',
    persistentMenu: 'userInput.persistentMenu',
    textPlaceholder: 'userInput.box.placeholder',
    userInputBoxStyle: 'userInput.box.style',
    userInputStyle: 'userInput.style',
    // Cover Component
    coverComponent: 'coverComponent.component',
    coverComponentProps: 'coverComponent.props',
    // Carousel
    customCarouselLeftArrow: 'carousel.arrow.left',
    customCarouselRightArrow: 'carousel.arrow.right',
    enableCarouselArrows: 'carousel.enableArrows',
  },
}

export const MIME_WHITELIST = {
  audio: ['audio/mpeg', 'audio/mp3'],
  document: ['application/pdf'],
  image: ['image/jpeg', 'image/png'],
  video: ['video/mp4', 'video/quicktime'],
}

export const MAX_ALLOWED_SIZE_MB = 10

export const ROLES = {
  ATTACHMENT_ICON: 'attachment-icon',
  EMOJI_PICKER_ICON: 'emoji-picker-icon',
  EMOJI_PICKER: 'emoji-picker',
  HEADER: 'header',
  MESSAGE_LIST: 'message-list',
  PERSISTENT_MENU_ICON: 'persistent-menu-icon',
  PERSISTENT_MENU: 'persistent-menu',
  SEND_BUTTON_ICON: 'send-button-icon',
  WEBCHAT: 'webchat',
  TRIGGER_BUTTON: 'trigger-button',
  TYPING_INDICATOR: 'typing-indicator',
  TEXT_BOX: 'textbox',
  WEBVIEW: 'webview',
  WEBVIEW_HEADER: 'webview-header',
  MESSAGE: 'message',
  IMAGE_MESSAGE: 'image-message',
  AUDIO_MESSAGE: 'audio-message',
  VIDEO_MESSAGE: 'video-message',
  DOCUMENT_MESSAGE: 'document-message',
  RAW_MESSAGE: 'raw-message',
}

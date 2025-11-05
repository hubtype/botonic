import BotonicLogo from './assets/botonic_react_logo100x100.png'
import UrlIcon from './assets/url-icon.png'

export const COLORS = {
  // http://chir.ag/projects/name-that-color
  APPLE_GREEN: '#3A9C35',
  BLEACHED_CEDAR_PURPLE: '#2E203B',
  BOTONIC_BLUE: '#0099FF',
  CACTUS_GREEN: '#60735E',
  CONCRETE_WHITE: '#F3F3F3',
  CURIOUS_BLUE: '#268BD2',
  DAINTREE_BLUE: '#002B35',
  ERROR_RED: '#FF2B5E',
  FRINGY_FLOWER_GREEN: '#C6E7C0',
  GRAY: '#818181',
  LIGHT_GRAY: '#D1D1D1',
  MID_GRAY: '#696973',
  PIGEON_POST_BLUE_ALPHA_0_5: 'rgba(176, 196, 222, 0.5)',
  RED_NOTIFICATIONS: '#FF426F',
  SCORPION_GRAY: '#575757',
  SEASHELL_WHITE: '#F1F0F0',
  SILVER: '#C8C8C8',
  SOLID_BLACK_ALPHA_0_2: 'rgba(0, 0, 0, 0.2)',
  SOLID_BLACK_ALPHA_0_5: 'rgba(0, 0, 0, 0.5)',
  SOLID_BLACK: '#000000',
  SOLID_WHITE_ALPHA_0_2: 'rgba(255, 255, 255, 0.2)',
  SOLID_WHITE_ALPHA_0_8: 'rgba(255, 255, 255, 0.8)',
  SOLID_WHITE: '#FFFFFF',
  TASMAN_GRAY: '#D1D8CF',
  TRANSPARENT: 'rgba(0, 0, 0, 0)',
  WILD_SAND_WHITE: '#F4F4F4',
  N700: '#393B45',
  N500: '#6D6A78',
  N100: '#E8E8EA',
  N50: '#F0F0F3',
}

export const WEBCHAT = {
  DEFAULTS: {
    LOGO: BotonicLogo,
    URL_ICON: UrlIcon,
    ELEMENT_WIDTH: 222,
    ELEMENT_MARGIN_RIGHT: 6,
    STORAGE_KEY: 'botonicState',
    HOST_ID: 'root',
    ID: 'botonic-webchat',
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
  SYSTEM_MESSAGE: 'system-message',
  IMAGE_MESSAGE: 'image-message',
  AUDIO_MESSAGE: 'audio-message',
  VIDEO_MESSAGE: 'video-message',
  DOCUMENT_MESSAGE: 'document-message',
  RAW_MESSAGE: 'raw-message',
  SYSTEM_DEBUG_TRACE_MESSAGE: 'system-debug-trace-message',
}

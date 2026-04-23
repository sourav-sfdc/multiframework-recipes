var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function(resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator['throw'](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ES imports so Vite bundles the fonts and returns base-aware URLs at runtime.
// (Plain '/assets/...' strings break on Salesforce where the app is not served
// from the org root.)
import OPEN_SANS_URL from '../assets/fonts/OpenSans.ttf';
import DM_SANS_URL from '../assets/fonts/DMSans.ttf';
import ROBOTO_FLEX_URL from '../assets/fonts/RobotoFlex.ttf';
function base64convert(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
export const fontsStyleSheet = () => __awaiter(void 0, void 0, void 0, function* () {
    const openSans = yield fetch(OPEN_SANS_URL);
    const openSansBase64 = yield base64convert(yield openSans.blob());
    const dmSans = yield fetch(DM_SANS_URL);
    const dmSansBase64 = yield base64convert(yield dmSans.blob());
    const robotoFlex = yield fetch(ROBOTO_FLEX_URL);
    const robotoFlexBase64 = yield base64convert(yield robotoFlex.blob());
    // font-face declarations to be used when exporting
    return `
    @font-face {
        font-family: 'Open Sans';
        font-stretch: 75% 125%;
        font-style: normal;
        font-weight: 125 950;
        src: url(${openSansBase64}) format('truetype');
    }

    @font-face {
        font-family: 'DM Sans';
        font-stretch: 75% 125%;
        font-style: italic;
        font-weight: 125 950;
        src: url(${dmSansBase64}) format('truetype');
    }

    @font-face {
        font-family: 'Roboto Flex';
        font-stretch: 75% 125%;
        font-style: normal;
        font-weight: 125 950;
        src: url(${robotoFlexBase64}) format('truetype');
    }
    `;
});

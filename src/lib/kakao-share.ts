/**
 * 카카오톡 공유.
 *
 * navigator.share는 카카오 인앱 브라우저에서 안 뜨거나 링크만 흘려보내는 경우가 있어서,
 * 한국에서 가장 중요한 공유 경로가 제일 불안정하다. Kakao SDK를 쓰면 제목·설명·이미지가
 * 박힌 피드 메시지로 나간다.
 *
 * NEXT_PUBLIC_KAKAO_JS_KEY가 없으면 이 모듈은 통째로 비활성이고 기존 공유 경로가
 * 그대로 쓰인다 — 키를 안 넣어도 아무것도 깨지지 않는다.
 */

interface KakaoLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoSdk {
  isInitialized(): boolean;
  init(key: string): void;
  Share: {
    sendDefault(settings: {
      objectType: "feed";
      content: {
        title: string;
        description: string;
        imageUrl: string;
        imageWidth?: number;
        imageHeight?: number;
        link: KakaoLink;
      };
      buttons?: { title: string; link: KakaoLink }[];
    }): void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

const SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? "";

export function isKakaoShareEnabled(): boolean {
  return KAKAO_JS_KEY.length > 0;
}

let sdkPromise: Promise<KakaoSdk | null> | null = null;

function loadSdk(): Promise<KakaoSdk | null> {
  if (!isKakaoShareEnabled()) return Promise.resolve(null);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<KakaoSdk | null>((resolve) => {
    if (window.Kakao) {
      resolve(window.Kakao);
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve(window.Kakao ?? null);
    script.onerror = () => {
      // 다음 클릭에서 다시 시도할 수 있게 캐시를 비운다.
      sdkPromise = null;
      resolve(null);
    };
    document.head.appendChild(script);
  }).then((sdk) => {
    if (sdk && !sdk.isInitialized()) sdk.init(KAKAO_JS_KEY);
    return sdk;
  });

  return sdkPromise;
}

export interface KakaoRoomShare {
  title: string;
  description: string;
  roomUrl: string;
  imageUrl: string;
}

/** 성공하면 true. false면 호출한 쪽이 기존 공유(링크 복사 등)로 넘어가야 한다. */
export async function shareRoomToKakao(share: KakaoRoomShare): Promise<boolean> {
  const sdk = await loadSdk();
  if (!sdk) return false;

  const link: KakaoLink = { mobileWebUrl: share.roomUrl, webUrl: share.roomUrl };

  try {
    sdk.Share.sendDefault({
      objectType: "feed",
      content: {
        title: share.title,
        description: share.description,
        imageUrl: share.imageUrl,
        imageWidth: 1200,
        imageHeight: 630,
        link,
      },
      buttons: [{ title: "답하러 가기", link }],
    });
    return true;
  } catch {
    return false;
  }
}

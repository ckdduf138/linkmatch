const HOUR_MS = 60 * 60 * 1000;

/**
 * 비공개방은 친구 그룹이 그날 안에 다 답하고 끝나는 물건이라 24시간이 맞다.
 * 공개방은 다르다 — 발견 피드와 랜딩의 "한 번 답해보세요"가 공개방으로 채워지는데,
 * 24시간마다 전부 사라지면 새 방문자가 매번 빈 사이트를 본다. 방 수명이 그대로
 * 사이트가 살아 있어 보이는 기간이 된다.
 */
export const PRIVATE_ROOM_HOURS = 24;
export const PUBLIC_ROOM_HOURS = 24 * 7;

export function roomLifetimeHours(isPublic: boolean): number {
  return isPublic ? PUBLIC_ROOM_HOURS : PRIVATE_ROOM_HOURS;
}

/** 사용자에게 보여주는 보관 기간 문구 */
export function roomLifetimeLabel(isPublic: boolean): string {
  const hours = roomLifetimeHours(isPublic);
  return hours >= 48 ? `${Math.round(hours / 24)}일` : `${hours}시간`;
}

export function roomExpiresAt(isPublic: boolean, from: Date = new Date()): Date {
  return new Date(from.getTime() + roomLifetimeHours(isPublic) * HOUR_MS);
}

/**
 * 새로 답한 사람 한 명당 공개방 수명이 늘어난다.
 *
 * 이게 이 제품의 유일한 유포 동기다. 공개방을 만든 사람에게는 지금까지 "친구한테
 * 보낼 이유"가 없었다. 답이 하나 들어올 때마다 방이 하루 더 열린다는 사실이 방장에게는
 * 공유할 이유를, 참여자에게는 기여감을 만든다.
 *
 * 1시간 같은 단위는 쓰지 않는다. 화면의 "N일 남음"이 안 움직이면 없는 기능이다.
 */
export const PUBLIC_ROOM_EXTENSION_HOURS = 24;

/** 상한. 없으면 인기 방이 영원히 살고, 중복 참여 우회로 수명을 무한정 늘릴 수 있다. */
export const PUBLIC_ROOM_MAX_HOURS = 24 * 30;

export const PUBLIC_ROOM_EXTENSION_LABEL = "하루";
export const PUBLIC_ROOM_MAX_LABEL = "30일";

/**
 * 연장된 만료 시각. 상한에 이미 닿았으면 null (업데이트할 필요 없음).
 * 상한은 생성 시각 기준이라 방이 아무리 인기가 많아도 결국 끝나고 아카이브로 넘어간다.
 */
export function extendedPublicExpiry(room: {
  createdAt: Date;
  expiresAt: Date;
}): Date | null {
  const cap = new Date(room.createdAt.getTime() + PUBLIC_ROOM_MAX_HOURS * HOUR_MS);
  if (room.expiresAt >= cap) return null;

  const next = new Date(room.expiresAt.getTime() + PUBLIC_ROOM_EXTENSION_HOURS * HOUR_MS);
  return next > cap ? cap : next;
}

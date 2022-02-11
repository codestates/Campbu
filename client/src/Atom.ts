import { atom } from 'recoil';

export const isLogin = atom({
  key: 'isLogin',
  default: false,
});

export const loginUserInfo = atom<{
  email: string;
  id: number;
  nickname: string;
  users_img: string;
}>({
  key: 'loginUserInfo',
  default: { email: 'string', id: 0, nickname: 'string', users_img: 'string' },
});

export const profileImgUrl = atom({
  key: 'profileImgUrl',
  default:
    'https://image-upload-storage-test.s3.ap-northeast-2.amazonaws.com/6d5b91f175a2a4ccb9221cb1c49730ef',
});

//? 주소 검색 결과 원본
export const originalPosts = atom<{
  posts:
    | {
        id: number;
        category: string;
        deposit: number;
        rental_fee: number;
        unavailable_dates: string[];
        title: string;
        content: string;
        longitude: number;
        latitude: number;
        address: string;
        img_urls: string[];
        users_id: number;
        likes_count: number;
      }[]
    | [];
}>({
  key: 'originalPosts',
  default: {
    posts: [],
  },
});

//? 주소 검색 결과 수정용
export const posts = atom<{
  posts:
    | {
        id: number;
        category: string;
        deposit: number;
        rental_fee: number;
        unavailable_dates: string[];
        title: string;
        content: string;
        longitude: number;
        latitude: number;
        address: string;
        img_urls: string[];
        users_id: number;
        likes_count: number;
      }[]
    | [];
}>({
  key: 'posts',
  default: {
    posts: [],
  },
});

//? 로그인모달 보여주기용 어떤페이지에서든 로그인버튼 누르면 나오게하기위함
export const showLoginModal = atom({
  key: 'showLoginModal',
  default: false,
});

//? 회원갑입 모달 보여주기용 어떤페이지에서든 로그인버튼 누르면 나오게하기위함
export const showSignupModal = atom({
  key: 'showSignupModal',
  default: false,
});

//? 리뷰 모달 보여주기용 어떤페이지에서든 로그인버튼 누르면 나오게하기위함
export const showReviewModal = atom({
  key: 'showReviewModal',
  default: false,
});

//? 리뷰 등록 확인
export const showSubmitModal = atom({
  key: 'showSubmitModal',
  default: false,
});

//? 경고 모달
export const showAlertModal = atom({
  key: 'showAlertModal',
  default: false,
});

//? 대여 확인 모달 : ㅇㅇ를 하시겠습니까? [예/아니오]
export const showConfirmModal = atom({
  key: 'showConfirmModal',
  default: false,
});

//? 완료 모달 : ㅇㅇ가 완료되었습니다.
export const showCompleteModal = atom({
  key: 'showCompleteModal',
  default: false,
});

//? 로딩 컴포넌트
export const isLoading = atom({
  key: 'isLoading',
  default: false,
});

//? 달력 컴포넌트용 전역 상태

export const selectDate = atom<string[]>({
  key: 'selectDate',
  default: [],
});

//?주소 선택용 전역 상태
//? 주소 선택
export const selectAddress = atom<string>({
  key: 'selectAddress',
  default: '',
});
//? 주소 목록
export const searchAddress = atom<string[]>({
  key: 'searchAddress',
  default: [],
});
//? 주소 목록창
export const showAddressList = atom({
  key: 'showAddressList',
  default: false,
});

//? 이미지 삽입 전역 상태

export const imgFile = atom<any[]>({
  key: 'imgFiles',
  default: [],
});

export const preView = atom<any[]>({
  key: 'preView',
  default: [],
});

export const formData = atom<any[]>({
  key: 'formData',
  default: [],
});

//? 상세페이지 전역상태 날짜

export const startDate = atom<string>({
  key: 'start',
  default: '',
});

export const endDate = atom<string>({
  key: 'end',
  default: '',
});

export const unableDate = atom<string[]>({
  key: 'unable',
  default: [],
});

export const isSelectStart = atom<boolean>({
  key: 'isStartSelect',
  default: true,
});

export const showCalendar = atom<boolean>({
  key: 'showCalendar',
  default: false,
});

//? 포스트 클릭 시 포스트 아이디 전달
export const post_id = atom<number>({
  key: 'post_id',
  default: 0,
});

//? 로그인 했을 때 좋아요 누른 포스트 아이디만 모아둔 배열
export const likedProducts = atom<number[]>({
  key: 'likedProducts',
  default: [],
});

//? 부재 중 온 채팅 개수 객체
interface chats {
  [key: string]: number;
}

export const chatsNum = atom<chats>({
  key: 'chatsNum',
  default: {
    total: 0,
  },
});

//? 드롭다운메뉴 온오프
export const showModal = atom<boolean>({
  key: 'showModal',
  default: false,
});

//? 강제 랜더를위한 상태
export const forceRender = atom<boolean>({
  key: 'forceRender',
  default: false,
});

//? 현재 채팅 중인 아이디
export const chattingRoomId = atom<number>({
  key: 'chattingRoomId',
  default: 0,
});

//? 유저가 참여 중인 채팅 방 아이디
export const allChatRoomId = atom<string>({
  key: 'allChatRoomId',
  default: '',
});

//? 선택된 카테고리
export const selectCategory = atom<string>({
  key: 'selectCategory',
  default: '전체',
});

//? navbarOn/Off
export const navbarOn = atom<boolean>({ key: 'navbarOn', default: true });

//? accessToken

export const jwtToken = atom<string>({ key: 'jwtToken', default: '' });

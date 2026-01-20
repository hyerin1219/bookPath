// bookClub
export interface IBookClub {
    id: string;
    clubName: string;
    password: string;
    createdAt: string;
    members: {
        user: string;
        nickname: string;
    }[];
}

// bookClub에 작성한 게시글
export interface IBookClubBoard {
    clubId: string;
    content: string;
    id: string;
    title: string;
    nickname: string;
    images: string[];
}

// naver 검색 api에서 받아온 책 정보
export interface IBookItems {
    author: string; // 저자
    description: string; // 설명글
    image: string; // 책 표지 이미지 URL
    isbn: string; // 책 등록번호
    title: string; // 책 제목
    content: string;
    rating: number;
    date: string;
    // link: string; // 상세 페이지 URL
    //iscount: string; // 할인 가격
    //pubdate: string; // 출간일
    publisher: string; // 출판사
}

// firebase에 등록한 독후감
export interface IBookPath {
    uid: string;
    isbn: string;
    author: string;
    title: string;
    content: string;
    image: string;
    date: string;
    rating: number;
    description: string;
    publisher: string;
}

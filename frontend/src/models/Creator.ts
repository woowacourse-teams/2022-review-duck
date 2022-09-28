export interface ResponseCreator {
  id: number;
  socialNickname: string;
  nickname: string;
  profileUrl: URLString;
}

class Creator {
  snsKey: number;
  snsName: string;
  nickname: string;
  profileImage: URLString;

  constructor(response: ResponseCreator) {
    this.snsKey = response.id;
    this.snsName = response.socialNickname;
    this.nickname = response.nickname;
    this.profileImage = response.profileUrl;
  }
}

export default Creator;

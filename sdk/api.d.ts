/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/users/{id}": {
    /** 根据userId获取用户 */
    get: operations["UsersController_getUserById"];
  };
  "/users": {
    /** 根据email获取用户 */
    get: operations["UsersController_getUserByEmail"];
  };
  "/users/{id}/friends": {
    /** 根据userId获取好友列表 */
    get: operations["UsersController_getFriendsById"];
  };
  "/users/{id}/friends/requests": {
    /** 根据userId获取好友请求列表 */
    get: operations["UsersController_getFriendRequestsById"];
    /** 发送一个好友请求，如果互相发送则后面发送的请求等价于直接同意之前的请求 */
    post: operations["UsersController_postFriendRequest"];
  };
  "/users/{id}/friends/requests/{requestId}/accept": {
    /** 同意好友请求 */
    put: operations["UsersController_acceptFriendRequest"];
  };
  "/users/{id}/friends/requests/{requestId}/reject": {
    /** 拒绝好友请求 */
    put: operations["UsersController_rejectFriendRequest"];
  };
  "/users/{id}/friends/{friendId}": {
    /** 获取好友信息 */
    get: operations["UsersController_getFriendInfoByUserIdAndFriendId"];
  };
  "/users/avatar/upload": {
    /** 上传头像 */
    post: operations["UsersController_uploadAvatar"];
  };
  "/chatrooms/{chatroomId}/visit": {
    /** 更新用户对于聊天室的最后访问时间 */
    put: operations["ChatroomsController_visitChatroom"];
  };
  "/chatrooms": {
    /** 根据userId和friendId获取单个单聊聊天室 */
    get: operations["ChatroomsController_getSingleChatroomByFriendId"];
  };
  "/chatrooms/summaries": {
    /** 获取聊天室信息概要 */
    get: operations["ChatroomsController_getChatroomSummaries"];
  };
  "/chatrooms/{chatroomId}": {
    /** 根据聊天室id获取单个聊天室 */
    get: operations["ChatroomsController_getChatroom"];
  };
  "/chatrooms/summaries/{chatroomId}": {
    get: operations["ChatroomsController_getChatroomSummary"];
  };
  "/auth/login": {
    /** 用户登录 */
    post: operations["AuthController_login"];
  };
  "/auth/email/code": {
    /** 发送邮箱验证码 */
    post: operations["AuthController_postEmail"];
  };
  "/auth/register": {
    /** 用户注册 */
    post: operations["AuthController_register"];
  };
  "/messages": {
    /** 根据roomId获取消息 */
    get: operations["MessagesController_getMessagesByChatroomId"];
    /** 在聊天室中发送消息 */
    post: operations["MessagesController_addMessage"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    UserVo: {
      /**
       * @description 唯一主键
       * @example 987654321
       */
      id: number;
      /**
       * @description 用户名
       * @example gamejoye
       */
      username: string;
      /**
       * @description 用户名邮箱
       * @example gamejoye@gmail.com
       */
      email: string;
      /**
       * @description 用户头像
       * @example https://gamejoye.top/static/media/bg.6885a3ed90df348b4f7a.jpeg
       */
      avatarUrl: string;
      /**
       * @description 用户个性签名
       * @example 天天开心， 天天向上
       */
      description: string;
      /**
       * @description 注册时间
       * @example 2024-03-23 19:12
       */
      createTime: string;
    };
    ApiBaseResult: {
      /** @description Http状态码 */
      statusCode: number;
      /** @description Http内容的简要概述 */
      message: string;
    };
    FriendRequestVo: {
      /**
       * @description FriendRequest ID
       * @example 1
       */
      id: number;
      /**
       * @description friendrequest创建时间
       * @example 2024-03-23 19:12
       */
      createTime: string;
      /**
       * @description friendrequest更新时间
       * @example 2024-03-23 19:15
       */
      updateTime: string;
      /**
       * @description 好友之间的关系
       * @example PENDING
       * @enum {string}
       */
      status: "PENDING" | "ACCEPT" | "REJECT";
      /** @description 好友请求发送者 */
      from: components["schemas"]["UserVo"];
      /** @description 好友请求接收者 */
      to: components["schemas"]["UserVo"];
    };
    PostFriendRequestDto: {
      /**
       * @description 发起请求的用户id
       * @example 1
       */
      from: number;
      /**
       * @description 接收者的用户id
       * @example 1
       */
      to: number;
    };
    FriendInfoVo: {
      /** @description 好友的基本信息 */
      user: components["schemas"]["UserVo"];
      /**
       * @description 好友请求创建的时间
       * @example 2024-05-20 19:12
       */
      createTime: string;
    };
    ChatroomVo: {
      /**
       * @description 房间号
       * @example 987654321
       */
      id: number;
      /**
       * @description 聊天室类型(单聊、多聊)
       * @example SINGLE
       * @enum {string}
       */
      type: "SINGLE" | "MULTIPLE";
      /**
       * @description 聊天室名字
       * @example chatroomName
       */
      name: string;
      /**
       * @description 聊天室的头像 当为单聊的时候为对方的头像
       * @example https://avatars.githubusercontent.com/u/88575063?v=4
       */
      avatarUrl: string;
      /**
       * @description 聊天室建立时间
       * @example 2024-03-23 19:12
       */
      createTime: string;
    };
    MessageVo: {
      /**
       * @description 消息id
       * @example 987654321
       */
      id: number;
      /**
       * @description 消息的暂时id从前端传来
       * @example 4751776
       */
      temporaryId: number;
      /** @description 消息所属聊天室 */
      chatroom: components["schemas"]["ChatroomVo"];
      /** @description 消息由谁发出 */
      from: components["schemas"]["UserVo"];
      /**
       * @description 消息内容
       * @example 你好，很高兴认识你
       */
      content: string;
      /**
       * @description 消息创建时间
       * @example 2024-03-23 19:12
       */
      createTime: string;
    };
    ChatroomSummaryVo: {
      /**
       * @description 当前聊天室最后一次用户的访问时间 最早为用户加入聊天室的时间
       * @example 2024-03-23 19:12
       */
      latestVisitTime: string;
      /**
       * @description 用户加入聊天室的时间
       * @example 2024-03-23 19:12
       */
      joinTime: string;
      /** @description 当前聊天室用户未读的消息数量 */
      unreadMessageCount: number;
      /**
       * @description 当前聊天室在线用户的id数组
       * @example [
       *   21,
       *   2642,
       *   366,
       *   4453,
       *   576,
       *   641,
       *   712
       * ]
       */
      onlineUserIds: number[];
      /** @description 当前summary记录所对应的chatroom */
      chatroom: components["schemas"]["ChatroomVo"];
      /** @description 当前聊天室的最新一条消息 */
      latestMessage: components["schemas"]["MessageVo"];
    };
    LoginVo: {
      /** @description 用户id */
      id: number;
      /** @description 用户登录成功后的认证信息 */
      token: string;
    };
    LoginUserRequestDto: {
      /**
       * @description 用户邮箱
       * @example gamejoye@gmail.com
       */
      email: string;
      /**
       * @description 用户密码
       * @example 147jkl...
       */
      password: string;
    };
    PostEmailCodeVo: {
      /**
       * @description 验证码有效时间
       * @example 60
       */
      validTime: number;
    };
    PostEmailCodeDto: {
      /**
       * @description 用户邮箱
       * @example gamejoye@gmail.com
       */
      email: string;
    };
    RegisterUserRequestDto: {
      /**
       * @description 用户名
       * @example gamejoye
       */
      username: string;
      /**
       * @description 用户邮箱
       * @example gamejoye@gmail.com
       */
      email: string;
      /**
       * @description 验证码
       * @example 189452
       */
      code: string;
      /**
       * @description 用户密码
       * @example 147jkl...
       */
      password: string;
      /**
       * @description 用户头像
       * @example https://gamejoye.top/static/media/bg.6885a3ed90df348b4f7a.jpeg
       */
      avatarUrl: string;
    };
    IAddMessageChatroomDto: {
      /** @description 待添加消息所属聊天室id */
      id: number;
    };
    IAddMessageFromDto: {
      /** @description 待添加消息发送者的id */
      id: number;
    };
    IAddMessageDto: {
      /** @description 前端用于展示loading Message所需要使用的暂时id */
      temporaryId: number;
      /** @description 待添加消息所需要的chatroom的基本信息 */
      chatroom: components["schemas"]["IAddMessageChatroomDto"];
      /** @description 待添加消息所需要的发送者的基本信息 */
      from: components["schemas"]["IAddMessageFromDto"];
      /** @description 消息的内容 */
      content: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  /** 根据userId获取用户 */
  UsersController_getUserById: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** @description 成功获取用户 */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["UserVo"];
          };
        };
      };
      /** @description 未找到用户 */
      404: {
        content: never;
      };
    };
  };
  /** 根据email获取用户 */
  UsersController_getUserByEmail: {
    parameters: {
      query: {
        /**
         * @description 待查询的用户邮箱
         * @example gamejoye@gmail.com
         */
        email: string;
      };
    };
    responses: {
      /** @description 成功根据email获取用户 */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["UserVo"];
          };
        };
      };
      /** @description 不存在的邮箱 */
      404: {
        content: never;
      };
    };
  };
  /** 根据userId获取好友列表 */
  UsersController_getFriendsById: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** @description 成功根据userId获取好友列表 */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["UserVo"][];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
      /** @description 权限不足 */
      403: {
        content: never;
      };
    };
  };
  /** 根据userId获取好友请求列表 */
  UsersController_getFriendRequestsById: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** @description 成功获取好友请求列表 */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["FriendRequestVo"][];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
      /** @description 权限不足 */
      403: {
        content: never;
      };
    };
  };
  /** 发送一个好友请求，如果互相发送则后面发送的请求等价于直接同意之前的请求 */
  UsersController_postFriendRequest: {
    parameters: {
      path: {
        id: number;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PostFriendRequestDto"];
      };
    };
    responses: {
      /** @description 成功发送好友请求或者默认同意之前的好友请求 */
      201: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["FriendRequestVo"];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
      /** @description 权限不足 */
      403: {
        content: never;
      };
      /** @description 重复发送好友请求 */
      409: {
        content: never;
      };
    };
  };
  /** 同意好友请求 */
  UsersController_acceptFriendRequest: {
    parameters: {
      path: {
        id: number;
        requestId: number;
      };
    };
    responses: {
      /** @description 成功通过好友请求 */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["FriendRequestVo"];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
      /** @description 权限不足 */
      403: {
        content: never;
      };
    };
  };
  /** 拒绝好友请求 */
  UsersController_rejectFriendRequest: {
    parameters: {
      path: {
        id: number;
        requestId: number;
      };
    };
    responses: {
      /** @description 成功拒绝好友请求 */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["FriendRequestVo"];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
      /** @description 权限不足 */
      403: {
        content: never;
      };
    };
  };
  /** 获取好友信息 */
  UsersController_getFriendInfoByUserIdAndFriendId: {
    parameters: {
      path: {
        id: number;
        friendId: number;
      };
    };
    responses: {
      /** @description 成功获取好友信息 */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["FriendInfoVo"];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
      /** @description 权限不足 */
      403: {
        content: never;
      };
    };
  };
  /** 上传头像 */
  UsersController_uploadAvatar: {
    requestBody: {
      content: {
        "multipart/form-data": {
          /** Format: binary */
          file: string;
        };
      };
    };
    responses: {
      /** @description 头像上传成功 */
      201: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: string;
          };
        };
      };
      /** @description 头像大小超过2MB */
      413: {
        content: never;
      };
    };
  };
  /** 更新用户对于聊天室的最后访问时间 */
  ChatroomsController_visitChatroom: {
    parameters: {
      query: {
        /**
         * @description 访问聊天室的最后时间戳
         * @example 2024-04-23 21:45
         */
        timestamp: string;
      };
      path: {
        chatroomId: number;
      };
    };
    responses: {
      /** @description 成功更新用户访问聊天室的最后时间 */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: string;
          };
        };
      };
      /** @description 聊天室不存在或者无权访问 */
      404: {
        content: never;
      };
    };
  };
  /** 根据userId和friendId获取单个单聊聊天室 */
  ChatroomsController_getSingleChatroomByFriendId: {
    parameters: {
      query: {
        /**
         * @description 好友id
         * @example 2
         */
        friend_id: number;
      };
    };
    responses: {
      /** @description 成功获取单个聊天室 */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["ChatroomVo"];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
      /** @description 未找到聊天室 */
      404: {
        content: never;
      };
    };
  };
  /** 获取聊天室信息概要 */
  ChatroomsController_getChatroomSummaries: {
    responses: {
      /** @description 成功获取chatroomSummaries */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["ChatroomSummaryVo"][];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
    };
  };
  /** 根据聊天室id获取单个聊天室 */
  ChatroomsController_getChatroom: {
    parameters: {
      path: {
        chatroomId: number;
      };
    };
    responses: {
      /** @description 成功获取单个聊天室 */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["ChatroomVo"];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
      /** @description 未找到聊天室 */
      404: {
        content: never;
      };
    };
  };
  ChatroomsController_getChatroomSummary: {
    parameters: {
      path: {
        chatroomId: number;
      };
    };
    responses: {
      /** @description 成功获取单个聊天室的chatroomSummaries */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["ChatroomSummaryVo"];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
    };
  };
  /** 用户登录 */
  AuthController_login: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["LoginUserRequestDto"];
      };
    };
    responses: {
      /** @description 登录成功 */
      201: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["LoginVo"];
          };
        };
      };
      /** @description 登录失败 */
      401: {
        content: never;
      };
    };
  };
  /** 发送邮箱验证码 */
  AuthController_postEmail: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["PostEmailCodeDto"];
      };
    };
    responses: {
      /** @description 验证码成功发送 */
      201: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["PostEmailCodeVo"];
          };
        };
      };
    };
  };
  /** 用户注册 */
  AuthController_register: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["RegisterUserRequestDto"];
      };
    };
    responses: {
      /** @description 注册成功 */
      201: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["UserVo"];
          };
        };
      };
      /** @description 注册失败 */
      401: {
        content: never;
      };
      /** @description 用户邮箱已经存在 */
      409: {
        content: never;
      };
    };
  };
  /** 根据roomId获取消息 */
  MessagesController_getMessagesByChatroomId: {
    parameters: {
      query: {
        /**
         * @description 房间id
         * @example 2
         */
        room_id: number;
      };
    };
    responses: {
      /** @description 成功获取聊天室消息 */
      200: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["MessageVo"][];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
      /** @description 聊天室不存在 */
      404: {
        content: never;
      };
    };
  };
  /** 在聊天室中发送消息 */
  MessagesController_addMessage: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["IAddMessageDto"];
      };
    };
    responses: {
      /** @description 成功发送消息 */
      201: {
        content: {
          "application/json": components["schemas"]["ApiBaseResult"] & {
            data: components["schemas"]["MessageVo"];
          };
        };
      };
      /** @description 未认证用户 */
      401: {
        content: never;
      };
      /** @description 无法在该聊天室发送消息 */
      403: {
        content: never;
      };
      /** @description 资源不存在 */
      404: {
        content: never;
      };
    };
  };
}

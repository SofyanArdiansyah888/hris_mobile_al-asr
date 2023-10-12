
/**
* Homeflow Technologies | UserEntity.
*
* @property name
* @property email
* @property password
* @property imei
* @property notification_token
*
* @create UserEntity
*/

export interface UserEntity {
  name: string;
  email: string;
  password: string;
  imei: string;
  notification_token: string;
  token?: string;
}


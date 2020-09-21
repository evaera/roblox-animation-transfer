export const LIST = "https://www.roblox.com/build/assets?assetTypeId=24"
export const HOME = "https://www.roblox.com/home"

export const asset = (id: number) =>
  `https://assetdelivery.roblox.com/v1/asset/?id=${id}`
export const userList = (userId: number, startRow = 0) =>
  `${LIST}&userId=${userId}&startRow=${startRow}`
export const groupList = (groupId: number, startRow = 0) =>
  `${LIST}&groupId=${groupId}&startRow=${startRow}`
export const publish = (title: string, description: string, groupId?: number) =>
  "https://www.roblox.com/ide/publish/uploadnewanimation" +
  "?assetTypeName=Animation" +
  `&name=${encodeURIComponent(title)}` +
  `&description=${encodeURIComponent(description)}` +
  "&AllID=1" +
  "&ispublic=False" +
  "&allowComments=True" +
  "&isGamesAsset=False" +
  (groupId != null ? `&groupId=${groupId}` : "")

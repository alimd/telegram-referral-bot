import {readFileSync} from 'fs';
import {jsonToCsv} from '@alwatr/nanolib';
import {writeFileSync} from '@alwatr/nanolib/node';

const storagePath = '../../deploy/_data/wesun-bot/db/m/user-list.col.asj';
const userListStorage = JSON.parse(readFileSync(storagePath, 'utf-8'));

/*
user: {
  "id": 5313450,
  "firstName": "S.A",
  "lastName": "Tafti",
  "username": "satafti",
  "phone": null,
  "invitedBy": null,
  "referralCount": 0,
  "blocked": true,
  "courses": {
    "symphonyInterest": true,
    "symphonyGroup": false,
    "symphonyPaid": false,
    "wesunGroup": false
  }
}
*/

const resultList = [];
const userIds = Object.keys(userListStorage.data);
let no = 0;

for (const id of userIds) {
  no++;
  const user = userListStorage.data[id].data;
  const invitedBy = user.invitedBy ? userListStorage.data[user.invitedBy].data : null;

  let referralCount = 0;
  let referralNames = [];
  let referralPayedCount = 0;
  let referralPayedNames = [];

  for (const rId of userIds) {
    const rUser = userListStorage.data[rId].data;
    if (rUser.invitedBy !== user.id) continue;
    referralCount++;
    referralNames.push(rUser.firstName + ' ' + rUser.lastName);
    if (rUser.courses?.symphonyPaid) {
      referralPayedCount++;
      referralPayedNames.push(rUser.firstName + ' ' + rUser.lastName);
    }
  }

  const result = {
    no,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    phone: user.phone,
    invitedBy: invitedBy ? invitedBy.firstName + ' ' + invitedBy.lastName : '',
    referralCount,
    referralPayedCount,
    referralPayedNames,
    referralNames,
  };

  resultList.push(result);
}

const csv = jsonToCsv(resultList);

writeFileSync('./user-list.csv', csv);

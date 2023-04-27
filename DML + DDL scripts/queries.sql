SELECT CONVERT_TZ(CONVERT_TZ(birth_date, 'Europe/Athens', 'UTC'), 'UTC', 'Europe/Athens') AS converted_datetime
FROM Users;

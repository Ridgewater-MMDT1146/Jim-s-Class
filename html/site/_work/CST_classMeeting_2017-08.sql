SELECT departmentCode AS "DEPT", courseNumber AS "NUMB", classmeetingBeginTime AS "Begin", classmeetingEndTime AS "End", classmeetingOnOff, roomId
FROM classmeeting
JOIN class ON class.classId = classmeeting.classId
JOIN course ON course.courseId = class.courseId
JOIN department ON department.departmentId = course.departmentId

WHERE classmeetingStartDate > '2017-08'
AND departmentCode = 'CST'
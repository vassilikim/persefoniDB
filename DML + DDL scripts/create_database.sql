DROP DATABASE IF EXISTS persefoniDB;
CREATE DATABASE persefoniDB;
USE persefoniDB;

CREATE TABLE School (
    ID INT NOT NULL AUTO_INCREMENT,
    school_name VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    principal VARCHAR(255) NOT NULL,
    school_active BIT NOT NULL DEFAULT(0),
    PRIMARY KEY (ID),
    INDEX school_active_index (school_active)
);

CREATE TABLE Book (
    ID INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    ISBN VARCHAR(255) NOT NULL,
    page_number INT NOT NULL,
    summary VARCHAR(255) NOT NULL,
    copies INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    lang VARCHAR(255) NOT NULL,
    keywords VARCHAR(255) NOT NULL,
    school_ID INT NOT NULL,
    PRIMARY KEY (ID),
    UNIQUE KEY (title, school_id),
    FOREIGN KEY (school_ID) REFERENCES School(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT CHECK (copies>=0),
    INDEX index_book_school (school_ID)
);

CREATE TABLE Writer (
    ID INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE Writes (
    writer_ID INT NOT NULL,
    book_ID INT NOT NULL,
    PRIMARY KEY (writer_ID, book_ID),
    FOREIGN KEY (writer_ID) REFERENCES Writer(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (book_ID) REFERENCES Book(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX index_writer (writer_ID),
    INDEX index_book_written (book_ID)
);

CREATE TABLE Genre (
    book_ID INT NOT NULL,
    genre VARCHAR(255) NOT NULL,
    PRIMARY KEY (genre, book_ID),
    FOREIGN KEY (book_ID) REFERENCES Book(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX index_book_genre (book_ID)
);

CREATE TABLE Users (
    ID INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_role ENUM('super-admin', 'school-admin', 'teacher', 'student') NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    school_ID INT DEFAULT(NULL),
    verified BIT NOT NULL DEFAULT(0),
    changed_password_at DATETIME DEFAULT(NULL),
    PRIMARY KEY (ID),
    FOREIGN KEY (school_ID) REFERENCES School(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX index_user_school (school_ID)
);

CREATE TABLE Reservation (
    user_ID INT NOT NULL,
    book_ID INT NOT NULL,
    request_date DATETIME NOT NULL DEFAULT(NOW()),
    pending_reservation_date DATETIME DEFAULT(NULL),
    canceled_at DATETIME DEFAULT(NULL),
	served_at DATETIME DEFAULT(NULL),
    reservation_status INT NOT NULL DEFAULT(0),
    PRIMARY KEY (user_ID, book_ID, request_date),
    FOREIGN KEY (user_ID) REFERENCES Users(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (book_ID) REFERENCES Book(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX index_reserv_user (user_ID),
    INDEX index_reserv_book (book_ID)
);

CREATE TABLE Lending (
    user_ID INT NOT NULL,
    book_ID INT NOT NULL,
    lending_date DATETIME NOT NULL DEFAULT(NOW()),
    must_be_returned_at DATETIME NOT NULL DEFAULT(DATE_ADD(NOW(),INTERVAL 1 MONTH)),
	was_returned_at DATETIME DEFAULT(NULL),
    PRIMARY KEY (user_ID, book_ID, lending_date),
    FOREIGN KEY (user_ID) REFERENCES Users(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (book_ID) REFERENCES Book(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX index_lend_user (user_ID),
    INDEX index_lend_book (book_ID)
);

CREATE TABLE Review (
    user_ID INT NOT NULL,
    book_ID INT NOT NULL,
    review VARCHAR(255) NOT NULL,
    rating FLOAT NOT NULL,
    verified BIT NOT NULL DEFAULT(0),
    PRIMARY KEY (user_ID, book_ID),
    FOREIGN KEY (user_ID) REFERENCES Users(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (book_ID) REFERENCES Book(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK (rating<=5.0 AND rating>=0.0),
    INDEX index_review_user (user_ID),
    INDEX index_review_book (book_ID)
);

CREATE VIEW activeUsers AS
(SELECT u.* FROM Users u JOIN School s ON u.school_ID=s.ID WHERE s.school_active=1)
UNION
(SELECT * FROM Users WHERE user_role='super-admin');

CREATE VIEW verifiedUsers AS
SELECT * FROM activeUsers WHERE verified=1;

DELIMITER $$
CREATE TRIGGER update_user_verification
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    IF NEW.user_role = 'super-admin' THEN
        SET NEW.verified = 1;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER update_review_verification
BEFORE INSERT ON Review
FOR EACH ROW
BEGIN
    IF (SELECT user_role FROM Users WHERE ID=New.user_id)='teacher' THEN
		SET New.verified = 1;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER make_school_active
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    IF (NEW.user_role = 'school-admin' AND 
    (SELECT COUNT(*) FROM Users WHERE (user_role='school-admin'AND school_ID=NEW.school_ID))=0) THEN
        UPDATE School SET school_active=1 WHERE ID=NEW.school_ID;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER make_school_inactive
AFTER DELETE ON Users
FOR EACH ROW
BEGIN
    IF (OLD.user_role = 'school-admin' AND 
    (SELECT COUNT(*) FROM Users WHERE (user_role='school-admin'AND school_ID=OLD.school_ID))=0) THEN
        UPDATE School SET school_active=0 WHERE ID=OLD.school_ID;
    END IF;
END$$
DELIMITER ;

DELIMITER //
CREATE TRIGGER hash_password_before_insert BEFORE INSERT ON Users
  FOR EACH ROW
  BEGIN
	SET NEW.user_password = SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts',
	NEW.user_password), 256);
  END;//

CREATE TRIGGER hash_password_before_update BEFORE UPDATE ON Users
  FOR EACH ROW
  BEGIN
	IF OLD.user_password <> NEW.user_password AND OLD.user_password <> SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts', NEW.user_password), 256) THEN
		SET NEW.user_password = SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts',
		NEW.user_password), 256);
	END IF;
  END;//
DELIMITER ;

DELIMITER //
CREATE FUNCTION change_password(user_username VARCHAR(255), old_password VARCHAR(255), new_password VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
  IF (SELECT user_password FROM Users WHERE username=user_username) = SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts', old_password), 256) THEN
    IF new_password=old_password THEN RETURN "OK"; END IF;
    UPDATE Users SET user_password=new_password, changed_password_at=NOW() WHERE username = user_username;
    RETURN 'OK';
  ELSE 
	RETURN 'NOT OK';
  END IF;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION check_user_login(p_username VARCHAR(255), p_password VARCHAR(255)) 
RETURNS INT DETERMINISTIC
BEGIN
  DECLARE count INT DEFAULT 0;
  
  IF (SELECT user_role FROM Users WHERE username = p_username) = 'super-admin' THEN
    SELECT COUNT(*) INTO count FROM Users WHERE username = p_username AND verified = 1 AND user_password = SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts', p_password), 256);
  ELSE
    SELECT COUNT(*) INTO count FROM verifiedUsers
    WHERE username = p_username AND user_password = SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts', p_password), 256);
  END IF;
  
  RETURN count;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION make_reservation(book_title VARCHAR(255), school INT, user INT, role VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	SET @book = (SELECT ID FROM Book WHERE title = book_title AND school_ID = school);
    IF @book IS NULL THEN RETURN 'NO BOOK'; END IF;
	IF role = 'teacher' THEN SET @reservationsAllowed=1;
	ELSEIF role = 'student' THEN SET @reservationsAllowed=2;
	END IF;
    IF (SELECT COUNT(*) FROM Reservation WHERE user_ID=user AND book_ID=@book AND (reservation_status=0 OR reservation_status=1)) <> 0 THEN
		RETURN 'ALREADY RESERVATION';
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=user AND book_ID=@book AND was_returned_at IS NULL) <> 0 THEN
		RETURN 'ALREADY LENDING';
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=user AND was_returned_at IS NULL AND must_be_returned_at<NOW()) <> 0 THEN
		RETURN 'DELAY';
	ELSEIF (SELECT COUNT(*) FROM Reservation WHERE user_ID=user AND reservation_status=0) > (@reservationsAllowed-1) THEN
		RETURN 'TOO MANY';
	ELSE 
		INSERT INTO Reservation (user_ID, book_ID) VALUES (user, @book);
		RETURN 'OK';
	END IF;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION handle_reservation(book_title VARCHAR(255), school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	SET @book = (SELECT ID FROM Book WHERE title = book_title AND school_ID = school);
    IF @book IS NULL THEN RETURN 'NO BOOK'; 
    END IF;
    
    SET @libraryuser = (SELECT ID FROM verifiedUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student'));
    IF @libraryuser IS NULL THEN RETURN 'NO USER'; 
    END IF;
    
    SET @userrole = (SELECT user_role FROM verifiedUsers WHERE username = u_username AND school_ID = school);
    
    IF (SELECT COUNT(*) FROM Reservation WHERE user_ID=@libraryuser AND book_ID=@book AND reservation_status=0) = 0 THEN
		SET @original = true;
	ELSE 
		SET @original = false;
	END IF;
    
	IF @userrole = 'teacher' THEN 
		SET @lendingsAllowed=1;
	ELSEIF @userrole = 'student' THEN 
		SET @lendingsAllowed=2;
	END IF;
    
    IF (SELECT COUNT(*) FROM Lending WHERE user_ID=@libraryuser AND book_ID=@book AND was_returned_at IS NULL) <> 0 THEN
		RETURN 'ALREADY LENDING';
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=@libraryuser AND was_returned_at IS NULL AND must_be_returned_at<NOW()) <> 0 THEN
		RETURN 'DELAY';
	ELSEIF (SELECT copies FROM Book WHERE ID=@book) = 0 THEN
		IF @original = false THEN
			UPDATE Reservation SET pending_reservation_date=NOW(), reservation_status=1 WHERE user_ID=@libraryuser AND book_ID=@book AND reservation_status=0;
            RETURN 'NO COPY, UPDATED TO PENDING';
		ELSE 
			RETURN 'NO COPY';
		END IF;
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=@libraryuser AND was_returned_at IS NULL) > (@lendingsAllowed-1) THEN
		RETURN 'TOO MANY';
	ELSE 
		INSERT INTO Lending (user_ID, book_ID) VALUES (@libraryuser, @book);
        UPDATE Book SET copies=copies-1 WHERE ID=@book;
        UPDATE Reservation SET served_at=NOW(), reservation_status=2 WHERE user_ID=@libraryuser AND book_ID=@book AND (reservation_status=0 OR reservation_status=1);
		RETURN 'OK';
	END IF;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION return_book(book_title VARCHAR(255), school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	SET @book = (SELECT ID FROM Book WHERE title = book_title AND school_ID = school);
    IF @book IS NULL THEN RETURN 'NO BOOK'; 
    END IF;
    
    SET @libraryuser = (SELECT ID FROM verifiedUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student'));
    IF @libraryuser IS NULL THEN RETURN 'NO USER'; 
    END IF;
    
    IF (SELECT COUNT(*) FROM Lending WHERE user_ID=@libraryuser AND book_ID=@book AND was_returned_at IS NULL) = 0 THEN
		RETURN 'NO LENDING';
	ELSE 
		UPDATE Book SET copies=copies+1 WHERE ID=@book;
        UPDATE Lending SET was_returned_at=NOW() WHERE user_ID=@libraryuser AND book_ID=@book;
        RETURN 'OK';
	END IF;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION cancel_reservation(book_title VARCHAR(255), school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	SET @book = (SELECT ID FROM Book WHERE title = book_title AND school_ID = school);
    IF @book IS NULL THEN RETURN 'NO BOOK'; 
    END IF;
    
    SET @libraryuser = (SELECT ID FROM verifiedUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student'));
    
    IF (SELECT COUNT(*) FROM Reservation WHERE user_ID=@libraryuser AND book_ID=@book AND (reservation_status=0 OR reservation_status=1)) = 0 THEN
		RETURN 'NO RESERVATION';
	ELSE 
        UPDATE Reservation SET canceled_at=NOW(), reservation_status=3 WHERE user_ID=@libraryuser AND book_ID=@book;
        RETURN 'OK';
	END IF;
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION deactivate_user(school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
    SET @libraryuser = (SELECT ID FROM verifiedUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student'));
    IF @libraryuser IS NULL THEN RETURN 'NO USER';
    END IF;
    
    UPDATE Reservation SET canceled_at=NOW(), reservation_status=3 WHERE user_ID=@libraryuser AND (reservation_status=0 OR reservation_status=1);
    UPDATE Book b JOIN Lending l ON l.book_ID=b.ID SET b.copies=b.copies+1, l.was_returned_at=NOW() WHERE l.user_ID=@libraryuser AND l.was_returned_at IS NULL;
    UPDATE Review SET verified=0 WHERE user_ID=@libraryuser;
    UPDATE Users SET verified=0 WHERE ID=@libraryuser;
    RETURN 'OK';
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION verify_teacher_student(school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	DECLARE libraryuser INT;
    DECLARE u_role VARCHAR(255);
    SELECT ID, user_role INTO @libraryuser, u_role FROM activeUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student');
    IF @libraryuser IS NULL THEN RETURN 'NO USER';
    END IF;
    
    UPDATE Users SET verified=1 WHERE ID=@libraryuser;
    IF u_role = 'teacher' THEN 
		UPDATE Review SET verified=1 WHERE user_ID=@libraryuser;
	END IF;
    RETURN 'OK';
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION delete_user(school INT, u_username VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
    SET @libraryuser = (SELECT ID FROM activeUsers WHERE username = u_username AND school_ID = school AND (user_role='teacher' OR user_role='student'));
    IF @libraryuser IS NULL THEN RETURN 'NO USER';
    END IF;
    
    DELETE FROM Reservation WHERE user_ID=@libraryuser;
    UPDATE Book b JOIN Lending l ON l.book_ID=b.ID SET b.copies=b.copies+1 WHERE l.user_ID=@libraryuser AND l.was_returned_at IS NULL;
    DELETE FROM Lending WHERE user_ID=@libraryuser;
    DELETE FROM Review WHERE user_ID=@libraryuser;
    DELETE FROM Users WHERE ID=@libraryuser;
    RETURN 'OK';
END//
DELIMITER ;

DELIMITER //
CREATE FUNCTION make_review(book_title VARCHAR(255), school INT, user INT, review VARCHAR(255), rating FLOAT) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	SET @book = (SELECT ID FROM Book WHERE title = book_title AND school_ID = school);
    IF @book IS NULL THEN RETURN 'NO BOOK'; END IF;
    
    IF (SELECT COUNT(*) FROM Lending WHERE user_ID=user AND book_ID=@book) = 0 THEN
		RETURN 'NO LENDING';
	END IF;
    
    INSERT INTO Review (user_ID, book_ID, review, rating) VALUES (user, @book, review, rating);
	RETURN 'OK';
END//
DELIMITER ;

DELIMITER //
CREATE EVENT cancel_reservations_after_one_week
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    UPDATE Reservation
    SET canceled_at = NOW(), reservation_status=3
    WHERE request_date <= DATE_SUB(NOW(), INTERVAL 1 WEEK) AND reservation_status=0
    OR pending_reservation_date <= DATE_SUB(NOW(), INTERVAL 1 WEEK) AND reservation_status=1;
END //
DELIMITER ;

DELIMITER //

CREATE FUNCTION DelSchool(schoolID INT)
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
IF ( select ID from school where ID = schoolID) is null then
	return "NOT OK";
ELSE 
	CREATE TEMPORARY TABLE delBooks(
		book_id INT PRIMARY KEY
	);
	CREATE TEMPORARY TABLE delWriters(
		id INT AUTO_INCREMENT PRIMARY KEY,
		writer_id INT 
	);

	INSERT INTO delBooks(book_id)
	SELECT ID
	FROM book
	WHERE school_ID = schoolID;

	INSERT INTO delWriters(writer_id)
	SELECT DISTINCT writer_ID
	FROM writes
	WHERE book_ID IN (SELECT book_id FROM delBooks);

	DELETE FROM reservation WHERE book_ID IN (SELECT book_id FROM delBooks);
	DELETE FROM lending WHERE book_ID IN (SELECT book_id FROM delBooks);
	DELETE FROM review WHERE book_ID IN (SELECT book_id FROM delBooks);
	DELETE FROM genre WHERE book_ID IN (SELECT book_id FROM delBooks);
	DELETE FROM writes WHERE book_ID IN (SELECT book_id FROM delBooks);
	DELETE FROM writer WHERE ID IN (SELECT writer_id FROM delWriters WHERE writer_id NOT IN (SELECT writer_ID FROM writes ));
	DELETE FROM book WHERE school_ID=schoolID;
	DELETE FROM users WHERE school_ID=schoolID;
	DELETE FROM school WHERE ID=schoolID;

    return "OK";
END IF;
END //

DELIMITER ;

DELIMITER //
CREATE PROCEDURE selectBooks(IN  schoolID INT)
BEGIN
CREATE TEMPORARY TABLE mywrites(
    book_id INT ,
    writer_id int,
    PRIMARY KEY(book_id, writer_id)
);
CREATE TEMPORARY TABLE books(
    book_id INT PRIMARY KEY
);
INSERT INTO Books(book_id)
SELECT ID
FROM book
WHERE school_ID = schoolID;

INSERT INTO mywrites(book_id, writer_id)
SELECT book_ID, writer_ID
FROM writes
WHERE book_ID in (select book_id from Books);

select book.ID, book.title, book.publisher, book.ISBN, book.page_number, book.summary, book.copies, book.image, book.lang, book.keywords, book.school_ID, gen.genres, final.full_names
from book
inner join (SELECT book_ID, GROUP_CONCAT(genre separator ", ") as genres
FROM genre 
where book_ID in (select book_id from Books) group by book_ID) as gen
on book.ID = gen.book_ID
inner join (select sm.book_id, group_concat(full_name separator ", ") as full_names from (
select book_id, concat(first_name, " ", last_name) as full_name
from(select mywrites.book_id, writer.first_name, writer.last_name
from mywrites
inner join writer on mywrites.writer_id = writer.ID) as books_writers) as sm group by book_id) as final
on final.book_id = book.ID;

END//

DELIMITER ;
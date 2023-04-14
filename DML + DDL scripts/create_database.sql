DROP DATABASE IF EXISTS persefoniDB;
CREATE DATABASE persefoniDB;
USE persefoniDB;

SET @@session.time_zone := '+06:00';

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
    reservation_status BIT NOT NULL DEFAULT(0),
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
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=user AND book_ID=@book AND was_returned_at=null) <> 0 THEN
		RETURN 'ALREADY LENDING';
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=user AND was_returned_at=null AND must_be_returned_at<NOW()) <> 0 THEN
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
CREATE FUNCTION handle_pending_reservation(book_title VARCHAR(255), school INT, user INT, role VARCHAR(255)) 
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
	SET @book = (SELECT ID FROM Book WHERE title = book_title AND school_ID = school);
    IF @book IS NULL THEN RETURN 'NO BOOK'; END IF;
	IF role = 'teacher' THEN SET @reservationsAllowed=1;
	ELSEIF role = 'student' THEN SET @reservationsAllowed=2;
	END IF;
    IF (SELECT COUNT(*) FROM Reservation WHERE user_ID=user AND book_ID=@book AND (reservation_status=0 OR reservation_status=1)) <> 0 THEN
		RETURN 'ALREADY RESERVATION';
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=user AND book_ID=@book AND was_returned_at=null) <> 0 THEN
		RETURN 'ALREADY LENDING';
	ELSEIF (SELECT COUNT(*) FROM Lending WHERE user_ID=user AND was_returned_at=null AND must_be_returned_at<NOW()) <> 0 THEN
		RETURN 'DELAY';
	ELSEIF (SELECT COUNT(*) FROM Reservation WHERE user_ID=user AND reservation_status=1 AND DATEDIFF(NOW(), reservation_date)<=7) > (@reservationsAllowed-1) THEN
		RETURN 'TOO MANY';
	ELSE 
		INSERT INTO Reservation (user_ID, book_ID) VALUES (user, @book);
		RETURN 'OK';
	END IF;
END//
DELIMITER ;

DELIMITER //
CREATE EVENT cancel_reservations_after_one_week
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    UPDATE Reservation
    SET canceled_at = NOW(), reservation_status=3
    WHERE request_at <= DATE_SUB(NOW(), INTERVAL 1 WEEK) AND (reservation_status=0 OR reservation_status=1);
END //
DELIMITER ;



<?php
    include './config-db.php';

    session_start();

    if (isset($_POST['user']) && isset($_POST['password'])) {
        try {
            $pdo = new PDO($DSN, $DB_USER_NAME, $DB_USER_PWD);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
                ':USER' => $_POST['user'],
                ':PASSWORD' => $_POST['password']
            ];

            $stmt = $pdo->prepare($SQL_SELECT_TB_USER);
            $stmt->execute($value);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($result) > 0 && isset($result[0]['USER'])) {
                $_SESSION['is_login'] = true;
                $_SESSION['user'] = $result[0]['USER'];

                header('Location: ./device.php');

            } else {
                header('Location: ./index.php');
            }

        } catch (Exception $e) {
            header('Location: ./index.php');
        }

    } else {
        header('Location: ./index.php');
    }
?>
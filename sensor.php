<?php
    include './login-check.php';
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css">

    <title>Device setting</title>
</head>
<body>
    <div id="nav">
        <main-nav page-name="<?=basename(__FILE__, '.php')?>"></main-nav>
    </div>

    <div id="container" class="container-fluid my-3 my-lg-5">
        <sensor-page></sensor-page>
    </div>

    <script src="lib/jquery/jquery-3.4.1.min.js"></script>
    <script src="lib/bootstrap/js/bootstrap.min.js"></script>
    <script src="lib/vuejs/vue.js"></script>
    <script src="js/dist/common.js"></script>
    <script src="js/dist/sensor.js"></script>
</body>
</html>
<?php
    include './api-login-check.php';
    include '../config-path.php';

    $data = [
        'code' => 99,
        'message' => 'data not found.'
    ];

    $file_list = [];
    $files = glob($PROTOCOL_CONFIG_PATH . '/*');

    foreach ($files as $file) {
        if (is_file($file)) {
            $name = basename($file, '.txt');

            $file_list[$name] = '../CONFIG/' . $name . '.txt';
        }
    }

    if (count($file_list) > 0) {
        $data = [
            'code' => 0,
            'data' => $file_list
        ];
    }

    echo json_encode($data, JSON_NUMERIC_CHECK);
?>
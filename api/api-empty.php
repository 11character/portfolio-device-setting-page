<?php
    $data = [
        'code' => 99,
        'message' => 'have no authority.'
    ];

    echo json_encode($data, JSON_NUMERIC_CHECK);
?>
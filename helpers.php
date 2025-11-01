<?php
/**
 * Luxe E-commerce Platform
 * Helper functions
 */

// This file contains helper functions for legacy compatibility
// Not actively used in the Next.js application

function luxe_get_version() {
    return '1.0.0';
}

function luxe_get_name() {
    return 'Luxe Premium E-Commerce';
}

function luxe_sanitize_input($input) {
    return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
}

// End of file

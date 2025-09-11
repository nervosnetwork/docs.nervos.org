#include "string.h"

// Complete some functions of string in std
const char* my_strchr(const char* str, char ch) {
    while (*str) {
        if (*str == ch) {
            return str;
        }
        str++;
    }
    return NULL;
}
int my_isspace(char c) {
    return c == ' ' || c == '\t' || c == '\n' || c == '\v' || c == '\f' ||
           c == '\r';
}
int my_isdigit(char c) { return c >= '0' && c <= '9'; }
const char* my_strstr(const char* haystack, const char* needle) {
    if (!*needle) {
        return haystack;
    }

    for (; *haystack; haystack++) {
        const char* h = haystack;
        const char* n = needle;

        while (*h && *n && (*h == *n)) {
            h++;
            n++;
        }

        if (!*n) {
            return haystack;
        }
    }

    return NULL;
}
int read_uint(const char** p) {
    int val = 0;
    while (**p >= '0' && **p <= '9') {
        val = val * 10 + (**p - '0');
        (*p)++;
    }
    return val;
}

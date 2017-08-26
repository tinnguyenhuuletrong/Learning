#include <functional>
#include <algorithm>
#include <iostream>

const char* findNext(const char* start, const char* end) {
    return std::find_if(start, end, [](char c) {return c == ' '; });
}

char* sortTheInnerContent(const char* words, int length) {
    
    char* buffer = new char[length + 1];
    buffer[length] = 0;
    memcpy(buffer, words, length);
    
    const char* begin = buffer;
    const char* strEnd = buffer + length;
    const char* end = buffer + length;
    do
    {
        end = findNext(begin, strEnd);
        //std::cout << end - begin << std::endl;
        
        if(end - begin > 1)
            sort((char*)begin + 1, (char*)end - 1, std::greater<char>());
        
        if (end >= strEnd)
            break;
        
        begin = end + 1;
    } while (true);
    
    return buffer;
}

void test () {
    const char* tmp = "sort the inner content in descending order";
    std::cout << sortTheInnerContent(tmp, strlen(tmp)) << std::endl;
}

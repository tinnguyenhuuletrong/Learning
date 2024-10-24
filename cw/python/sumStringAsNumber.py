import time

# Note
#  List or string should always append to last.
#       -> a lot of faster than insert to head
# a += '1' vs  '1' + a

def sum_strings(x, y):
    len_a =len(x)
    len_b =len(y)
    size = max(len_a, len_b)

    x = x.zfill(size) 
    y = y.zfill(size) 

    c = ''
    i = size-1
    carry = 0
    while i>=0:
        carry, val = divmod(int(x[i]) + int(y[i]) + carry , 10)
        c += str(val)
        i-=1

    if carry !=0:
        c += "1"
    
    res = c[::-1].lstrip('0')

    if res == '':
        return '0'

    return res


if __name__ == "__main__":
    # x = "216321267166848412471324995114783456776771180109829202956536067232679842380856209927637550563907430921875900207728480986682979244173988737258625450013068656279385525689279532234925856095273023811457604813983875899990099802071419179774438002746734044416494299313055036477534"
    # y = "40002539417118125"
    # ans = "216321267166848412471324995114783456776771180109829202956536067232679842380856209927637550563907430921875900207728480986682979244173988737258625450013068656279385525689279532234925856095273023811457604813983875899990099802071419179774438002746734044416494339315594453595659"

    # x = "01234"
    # y = "567"
    # ans = "1801"

    # startTime = time.time()
    # res = sum_strings(x, y)
    # print("res=", res, res == ans)
    # print(f"elaspedTime: {(time.time() - startTime)}")


    
    x = "1234567890" * 1000000
    y = "1234567890" * 1000000
    startTime = time.time()
    res = sum_strings(x, y)
    elaspedTime = time.time() - startTime
    print(f"elaspedTime: {elaspedTime: .2d}")
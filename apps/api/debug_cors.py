import requests

def test_cors():
    url = "http://localhost:8000/health"
    headers = {"Origin": "http://localhost:3000"}
    
    print(f"Testing OPTIONS {url} with Origin: {headers['Origin']}")
    try:
        resp = requests.options(url, headers=headers)
        print(f"Status: {resp.status_code}")
        print("Headers:")
        for k, v in resp.headers.items():
            if 'access-control' in k.lower():
                print(f"  {k}: {v}")
                
        if 'access-control-allow-origin' not in [k.lower() for k in resp.headers]:
            print("❌ MISSING Access-Control-Allow-Origin header!")
        else:
            print("✅ Access-Control-Allow-Origin present.")

    except Exception as e:
        print(f"Error: {e}")

    print("-" * 20)
    
    url = "http://localhost:8000/api/v1/auth/login"
    print(f"Testing POST {url} with Origin: {headers['Origin']}")
    try:
        resp = requests.post(url, headers=headers, json={"email": "manohar.k@ums.edu", "password": "Student@123"})
        print(f"Status: {resp.status_code}")
        print("Headers:")
        for k, v in resp.headers.items():
            if 'access-control' in k.lower():
                print(f"  {k}: {v}")
                
        if 'access-control-allow-origin' not in [k.lower() for k in resp.headers]:
            print("❌ MISSING Access-Control-Allow-Origin header!")
        else:
            print("✅ Access-Control-Allow-Origin present.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_cors()

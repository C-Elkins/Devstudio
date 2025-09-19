#!/usr/bin/env bash
set -euo pipefail

API=${API_URL:-http://localhost:5002/api}
USERNAME=${1:-admin}
PASSWORD=${2:-admin}

echo "API: $API"

echo "
1) Login..."
LOGIN_RESP=$(curl -s -X POST "$API/admin/login" -H "Content-Type: application/json" -d '{"username":"'$USERNAME'","password":"'$PASSWORD'"}')
echo "Login response: $LOGIN_RESP"

TOKEN=$(echo "$LOGIN_RESP" | python3 -c "import sys, json
try:
    obj=json.load(sys.stdin)
    print(obj.get('token',''))
except Exception:
    print('')")
echo "Token: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo "No token returned; aborting further authenticated tests."
  exit 1
fi

echo "
2) Create invite..."
CREATE_RESP=$(curl -s -X POST "$API/admin/invite" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"ttlHours":24}')
echo "Create response: $CREATE_RESP"

INVITE_TOKEN=$(echo "$CREATE_RESP" | python3 -c "import sys, json
try:
    obj=json.load(sys.stdin)
    print(obj.get('data',{}).get('token',''))
except Exception:
    print('')")
echo "Invite token: $INVITE_TOKEN"

if [ -z "$INVITE_TOKEN" ]; then
  echo "Failed to create invite token; aborting."
  exit 1
fi

echo "
3) Redeem invite (show headers to capture cookie)..."
REDEEM_RESP_HEADERS=$(curl -s -i -X POST "$API/admin/redeem-invite" -H "Content-Type: application/json" -d '{"token":"'$INVITE_TOKEN'"}')
echo "$REDEEM_RESP_HEADERS"

# Extract cookie name=value
COOKIE=$(echo "$REDEEM_RESP_HEADERS" | awk '/Set-Cookie: /{print $2}' | sed 's/;.*$//' | tr -d '\r' || true)
echo "Cookie extracted: $COOKIE"

if [ -z "$COOKIE" ]; then
  echo "No cookie set on redeem; continuing but invite-status check may fail."
fi

echo "
4) Invite status (with cookie)..."
STATUS_RESP=$(curl -s -X GET "$API/admin/invite-status" -H "Cookie: $COOKIE")
echo "Status: $STATUS_RESP"

echo "
5) List invites (auth)..."
LIST_RESP=$(curl -s -X GET "$API/admin/invites" -H "Authorization: Bearer $TOKEN")
echo "Invites: $LIST_RESP"

echo "
6) Revoke invite..."
REVOKE_RESP=$(curl -s -X DELETE "$API/admin/invite/$INVITE_TOKEN" -H "Authorization: Bearer $TOKEN")
echo "Revoke: $REVOKE_RESP"

echo "
7) List invites after revoke..."
LIST2_RESP=$(curl -s -X GET "$API/admin/invites" -H "Authorization: Bearer $TOKEN")
echo "Invites after revoke: $LIST2_RESP"

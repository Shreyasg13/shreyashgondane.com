#!/usr/bin/env bash
# Wait (max ~70 min) for public DNS + GitHub's certificate, then enforce HTTPS and confirm the live page.
R=Shreyasg13/shreyashgondane.com
for i in $(seq 1 140); do
  ip=$(nslookup shreyashgondane.com 1.1.1.1 2>/dev/null | grep -c "185.199")
  st=$(gh api repos/$R/pages --jq '.https_certificate.state // "none"' 2>/dev/null)
  echo "$(date -u +%H:%M) dns_ok=$([ "$ip" -gt 0 ] && echo yes || echo no) cert=$st"
  if [ "$ip" -gt 0 ] && [ "$st" = "approved" ]; then
    gh api -X PUT repos/$R/pages -F https_enforced=true >/dev/null && echo "HTTPS enforced"
    curl -s -o /dev/null -w "https://shreyashgondane.com -> %{http_code}\n" --max-time 20 https://shreyashgondane.com/
    curl -s --max-time 20 https://shreyashgondane.com/ | grep -o "<title>[^<]*" | head -1
    exit 0
  fi
  [ "$ip" -gt 0 ] && [ $((i % 6)) -eq 0 ] && gh api -X PUT repos/$R/pages -f cname=shreyashgondane.com >/dev/null 2>&1
  sleep 30
done
echo "TIMEOUT: still waiting"; exit 1

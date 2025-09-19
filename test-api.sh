#!/bin/bash

echo "🧪 Testing DevStudio Backend API..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test server health
echo -e "\n1. Testing server health..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✅ Server is running${NC}"
else
    echo -e "${RED}❌ Server is not responding (Make sure backend is running)${NC}"
    exit 1
fi

# Test contact form submission
echo -e "\n2. Testing contact form submission..."
response=$(curl -s -X POST http://localhost:5000/api/contact \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test User",
        "email": "test@example.com",
        "message": "This is a test message",
        "projectType": "Web Development",
        "budget": "$5K - $15K",
        "timeline": "1-3 months"
    }' \
    -w "%{http_code}")

if [[ $response == *"201"* ]]; then
    echo -e "${GREEN}✅ Contact form submission works${NC}"
else
    echo -e "${YELLOW}⚠️  Contact form test failed (Check MongoDB connection)${NC}"
fi

# Test contact retrieval
echo -e "\n3. Testing contact retrieval..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/contact)
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✅ Contact retrieval works${NC}"
else
    echo -e "${YELLOW}⚠️  Contact retrieval failed${NC}"
fi

# Test projects endpoint
echo -e "\n4. Testing projects endpoint..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/projects)
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✅ Projects endpoint works${NC}"
else
    echo -e "${YELLOW}⚠️  Projects endpoint failed${NC}"
fi

# Test testimonials endpoint
echo -e "\n5. Testing testimonials endpoint..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/testimonials)
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✅ Testimonials endpoint works${NC}"
else
    echo -e "${YELLOW}⚠️  Testimonials endpoint failed${NC}"
fi

echo -e "\n${GREEN}🎉 API testing complete!${NC}"
echo -e "\n${YELLOW}📝 Notes:${NC}"
echo "- If any tests failed, check that MongoDB is running"
echo "- Email functionality requires SMTP configuration"
echo "- Visit http://localhost:3000 to test the frontend"
echo "- Use admin/admin123 to access the admin dashboard"
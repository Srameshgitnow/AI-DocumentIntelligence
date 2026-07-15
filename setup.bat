@echo off
REM AI Document Intelligence - Setup Script for Windows

echo 🚀 Setting up AI Document Intelligence Platform
echo.

REM Create backend environment file
echo 📝 Creating backend configuration...
if not exist "backend\.env" (
  copy backend\.env.example backend\.env
  echo ✓ backend\.env created. Please edit with your OpenAI API key.
) else (
  echo ✓ backend\.env already exists
)

REM Create frontend environment file
echo 📝 Creating frontend configuration...
if not exist "frontend\.env" (
  (
    echo REACT_APP_API_URL=http://localhost:5000/api
  ) > frontend\.env
  echo ✓ frontend\.env created
) else (
  echo ✓ frontend\.env already exists
)

REM Install dependencies
echo 📦 Installing dependencies...

echo   Installing backend dependencies...
cd backend
call npm install
cd ..

echo   Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo   1. Edit backend\.env and add your OpenAI API key
echo   2. Run: docker-compose up (for Docker)
echo   3. Or run: npm run dev in backend/ and frontend/ separately
echo.
echo 📖 Documentation: See README.md

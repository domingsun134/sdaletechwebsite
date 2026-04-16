#!/bin/bash

# Script to download all investor relations files
# Run this script from the project root directory

echo "Creating directory structure..."

# Create directories
mkdir -p public/investor-relations/images
mkdir -p public/investor-relations/annual-reports
mkdir -p public/investor-relations/sustainability-reports
mkdir -p public/investor-relations/financials

cd public/investor-relations

echo "Downloading cover images..."

# Download images
curl -L -o images/ar2019-cover.jpg "https://sunningdale.listedcompany.com/images/ar2019.jpg"
curl -L -o images/sr2020-cover.jpg "https://investor.sdaletech.com/images/sr2020.jpg"

echo "Downloading annual reports (this may take several minutes)..."

# Download annual reports
curl -L -o annual-reports/ar2019.pdf "https://sunningdale.listedcompany.com/newsroom/20200414_182713_BHQ_4QDCQ2N7D7SLXQND.2.pdf"
curl -L -o annual-reports/ar2018.pdf "https://sunningdale.listedcompany.com/newsroom/20190325_003535_BHQ_FZRU3RIDPJYOPMKM.1.pdf"
curl -L -o annual-reports/ar2017.pdf "http://sunningdale.listedcompany.com/misc/ar2017.pdf"
curl -L -o annual-reports/ar2016.pdf "http://sunningdale.listedcompany.com/misc/ar2016.pdf"
curl -L -o annual-reports/ar2015.pdf "http://sunningdale.listedcompany.com/misc/ar2015/ar2015.pdf"
curl -L -o annual-reports/ar2014.pdf "http://sunningdale.listedcompany.com/misc/ar2014/ar2014.pdf"
curl -L -o annual-reports/ar2013.pdf "http://sunningdale.listedcompany.com/misc/ar2013/ar2013.pdf"
curl -L -o annual-reports/ar2012.pdf "http://sunningdale.listedcompany.com/misc/ar2012.pdf"
curl -L -o annual-reports/ar2011.pdf "http://sunningdale.listedcompany.com/misc/ar2011.pdf"
curl -L -o annual-reports/ar2010.pdf "http://sunningdale.listedcompany.com/misc/ar2010.pdf"
curl -L -o annual-reports/ar2009.pdf "http://sunningdale.listedcompany.com/misc/ar2009.pdf"
curl -L -o annual-reports/ar2008.pdf "http://sunningdale.listedcompany.com/misc/ar2008.pdf"
curl -L -o annual-reports/ar2007.pdf "http://sunningdale.listedcompany.com/misc/ar2007.pdf"
curl -L -o annual-reports/ar2006.pdf "http://sunningdale.listedcompany.com/misc/ar2006.pdf"
curl -L -o annual-reports/ar2005.pdf "http://sunningdale.listedcompany.com/misc/ar2005.pdf"
curl -L -o annual-reports/ar2005a.pdf "http://sunningdale.listedcompany.com/misc/ar2005a.pdf"
curl -L -o annual-reports/ar2004.pdf "http://sunningdale.listedcompany.com/misc/ar2004.pdf"
curl -L -o annual-reports/ar2004a.pdf "http://sunningdale.listedcompany.com/misc/ar2004a.pdf"

echo "Downloading sustainability reports..."

# Download sustainability reports
curl -L -o sustainability-reports/sr2020.pdf "https://investor.sdaletech.com/misc/Sunningdale_Tech_Sustainability_Report_2020.pdf"
curl -L -o sustainability-reports/sr2019.pdf "https://investor.sdaletech.com/newsroom/20200515_192521_BHQ_L1Y2WP6VRE0VBDTC.1.pdf"
curl -L -o sustainability-reports/sr2018.pdf "https://investor.sdaletech.com/newsroom/20190527_194304_BHQ_CQ5BMSI02BFB6BR9.1.pdf"
curl -L -o sustainability-reports/sr2017.pdf "https://investor.sdaletech.com/newsroom/20181003_182334_BHQ_LMCFVFUM4X51QQLU.1.pdf"

echo "Downloading financial statement..."

# Download financial statement
curl -L -o financials/fy2020-statement.pdf "https://investor.sdaletech.com/newsroom/20210226_185425_BHQ_MH5I9ENKZA968VFA.1.pdf"

cd ../..

echo ""
echo "=========================================="
echo "Download complete!"
echo "=========================================="
echo ""
echo "Files have been downloaded to:"
echo "  - public/investor-relations/images/"
echo "  - public/investor-relations/annual-reports/"
echo "  - public/investor-relations/sustainability-reports/"
echo "  - public/investor-relations/financials/"
echo ""
echo "Total files downloaded:"
echo "  - 2 cover images"
echo "  - 18 annual report PDFs"
echo "  - 4 sustainability report PDFs"
echo "  - 1 financial statement PDF"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Navigate to http://localhost:5173/investor-relations"
echo "  3. Test all the pages and verify PDF downloads"
echo ""

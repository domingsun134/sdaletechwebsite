# Investor Relations Files

This directory contains all self-hosted investor relations documents and assets.

## Directory Structure

```
public/investor-relations/
├── images/
│   ├── ar2019-cover.jpg
│   └── sr2020-cover.jpg
├── annual-reports/
│   ├── ar2019.pdf
│   ├── ar2018.pdf
│   ├── ar2017.pdf
│   └── ... (ar2004.pdf to ar2019.pdf)
├── sustainability-reports/
│   ├── sr2020.pdf
│   ├── sr2019.pdf
│   ├── sr2018.pdf
│   └── sr2017.pdf
└── financials/
    └── fy2020-statement.pdf
```

## Files to Download

### Annual Reports (18 PDFs)

Download from the following URLs and save to `public/investor-relations/annual-reports/`:

1. **ar2019.pdf** (2.95 MB)
   - https://sunningdale.listedcompany.com/newsroom/20200414_182713_BHQ_4QDCQ2N7D7SLXQND.2.pdf

2. **ar2018.pdf** (2.51 MB)
   - https://sunningdale.listedcompany.com/newsroom/20190325_003535_BHQ_FZRU3RIDPJYOPMKM.1.pdf

3. **ar2017.pdf** (1.87 MB)
   - http://sunningdale.listedcompany.com/misc/ar2017.pdf

4. **ar2016.pdf** (8.99 MB)
   - http://sunningdale.listedcompany.com/misc/ar2016.pdf

5. **ar2015.pdf** (2.36 MB)
   - http://sunningdale.listedcompany.com/misc/ar2015/ar2015.pdf

6. **ar2014.pdf** (6.74 MB)
   - http://sunningdale.listedcompany.com/misc/ar2014/ar2014.pdf

7. **ar2013.pdf** (1.09 MB)
   - http://sunningdale.listedcompany.com/misc/ar2013/ar2013.pdf

8. **ar2012.pdf** (1.65 MB)
   - http://sunningdale.listedcompany.com/misc/ar2012.pdf

9. **ar2011.pdf** (1.77 MB)
   - http://sunningdale.listedcompany.com/misc/ar2011.pdf

10. **ar2010.pdf** (1.90 MB)
    - http://sunningdale.listedcompany.com/misc/ar2010.pdf

11. **ar2009.pdf** (2.09 MB)
    - http://sunningdale.listedcompany.com/misc/ar2009.pdf

12. **ar2008.pdf** (5.17 MB)
    - http://sunningdale.listedcompany.com/misc/ar2008.pdf

13. **ar2007.pdf** (2.94 MB)
    - http://sunningdale.listedcompany.com/misc/ar2007.pdf

14. **ar2006.pdf** (11.49 MB)
    - http://sunningdale.listedcompany.com/misc/ar2006.pdf

15. **ar2005.pdf** (1.92 MB)
    - http://sunningdale.listedcompany.com/misc/ar2005.pdf

16. **ar2005a.pdf** (3.67 MB) - Alternative version
    - http://sunningdale.listedcompany.com/misc/ar2005a.pdf

17. **ar2004.pdf** (1.61 MB)
    - http://sunningdale.listedcompany.com/misc/ar2004.pdf

18. **ar2004a.pdf** (16.42 MB) - Alternative version
    - http://sunningdale.listedcompany.com/misc/ar2004a.pdf

### Sustainability Reports (4 PDFs)

Download from the following URLs and save to `public/investor-relations/sustainability-reports/`:

1. **sr2020.pdf** (7.21 MB)
   - https://investor.sdaletech.com/misc/Sunningdale_Tech_Sustainability_Report_2020.pdf

2. **sr2019.pdf** (2.50 MB)
   - https://investor.sdaletech.com/newsroom/20200515_192521_BHQ_L1Y2WP6VRE0VBDTC.1.pdf

3. **sr2018.pdf** (1.41 MB)
   - https://investor.sdaletech.com/newsroom/20190527_194304_BHQ_CQ5BMSI02BFB6BR9.1.pdf

4. **sr2017.pdf** (1.02 MB)
   - https://investor.sdaletech.com/newsroom/20181003_182334_BHQ_LMCFVFUM4X51QQLU.1.pdf

### Financial Statements (1 PDF)

Download from the following URL and save to `public/investor-relations/financials/`:

1. **fy2020-statement.pdf** (352 KB)
   - https://investor.sdaletech.com/newsroom/20210226_185425_BHQ_MH5I9ENKZA968VFA.1.pdf

### Images (2 files)

Download from the following URLs and save to `public/investor-relations/images/`:

1. **ar2019-cover.jpg**
   - https://sunningdale.listedcompany.com/images/ar2019.jpg

2. **sr2020-cover.jpg**
   - https://investor.sdaletech.com/images/sr2020.jpg

## Optional: Flipbook Versions

If you want to host the interactive flipbook versions of annual reports (2011-2019), download the entire directories from:

- AR 2019: https://sunningdale.listedcompany.com/misc/ar2019/
- AR 2018: https://sunningdale.listedcompany.com/misc/ar2018/index.html
- AR 2017: http://sunningdale.listedcompany.com/misc/ar2017/index.html
- AR 2016: http://sunningdale.listedcompany.com/misc/ar2016/index.html
- AR 2015: http://sunningdale.listedcompany.com/misc/ar2015/index.html
- AR 2014: http://sunningdale.listedcompany.com/misc/ar2014_updated/index.html
- AR 2013: http://sunningdale.listedcompany.com/misc/ar2013/index.html
- AR 2012: http://sunningdale.listedcompany.com/misc/ar2012
- AR 2011: http://sunningdale.listedcompany.com/misc/ar2011/index.html

Save these directories to `public/investor-relations/annual-reports/arXXXX-flipbook/`

## Download Script

You can use the following bash script to download all files:

```bash
#!/bin/bash

# Create directories
mkdir -p public/investor-relations/images
mkdir -p public/investor-relations/annual-reports
mkdir -p public/investor-relations/sustainability-reports
mkdir -p public/investor-relations/financials

cd public/investor-relations

# Download images
curl -o images/ar2019-cover.jpg "https://sunningdale.listedcompany.com/images/ar2019.jpg"
curl -o images/sr2020-cover.jpg "https://investor.sdaletech.com/images/sr2020.jpg"

# Download annual reports
curl -o annual-reports/ar2019.pdf "https://sunningdale.listedcompany.com/newsroom/20200414_182713_BHQ_4QDCQ2N7D7SLXQND.2.pdf"
curl -o annual-reports/ar2018.pdf "https://sunningdale.listedcompany.com/newsroom/20190325_003535_BHQ_FZRU3RIDPJYOPMKM.1.pdf"
curl -o annual-reports/ar2017.pdf "http://sunningdale.listedcompany.com/misc/ar2017.pdf"
curl -o annual-reports/ar2016.pdf "http://sunningdale.listedcompany.com/misc/ar2016.pdf"
curl -o annual-reports/ar2015.pdf "http://sunningdale.listedcompany.com/misc/ar2015/ar2015.pdf"
curl -o annual-reports/ar2014.pdf "http://sunningdale.listedcompany.com/misc/ar2014/ar2014.pdf"
curl -o annual-reports/ar2013.pdf "http://sunningdale.listedcompany.com/misc/ar2013/ar2013.pdf"
curl -o annual-reports/ar2012.pdf "http://sunningdale.listedcompany.com/misc/ar2012.pdf"
curl -o annual-reports/ar2011.pdf "http://sunningdale.listedcompany.com/misc/ar2011.pdf"
curl -o annual-reports/ar2010.pdf "http://sunningdale.listedcompany.com/misc/ar2010.pdf"
curl -o annual-reports/ar2009.pdf "http://sunningdale.listedcompany.com/misc/ar2009.pdf"
curl -o annual-reports/ar2008.pdf "http://sunningdale.listedcompany.com/misc/ar2008.pdf"
curl -o annual-reports/ar2007.pdf "http://sunningdale.listedcompany.com/misc/ar2007.pdf"
curl -o annual-reports/ar2006.pdf "http://sunningdale.listedcompany.com/misc/ar2006.pdf"
curl -o annual-reports/ar2005.pdf "http://sunningdale.listedcompany.com/misc/ar2005.pdf"
curl -o annual-reports/ar2005a.pdf "http://sunningdale.listedcompany.com/misc/ar2005a.pdf"
curl -o annual-reports/ar2004.pdf "http://sunningdale.listedcompany.com/misc/ar2004.pdf"
curl -o annual-reports/ar2004a.pdf "http://sunningdale.listedcompany.com/misc/ar2004a.pdf"

# Download sustainability reports
curl -o sustainability-reports/sr2020.pdf "https://investor.sdaletech.com/misc/Sunningdale_Tech_Sustainability_Report_2020.pdf"
curl -o sustainability-reports/sr2019.pdf "https://investor.sdaletech.com/newsroom/20200515_192521_BHQ_L1Y2WP6VRE0VBDTC.1.pdf"
curl -o sustainability-reports/sr2018.pdf "https://investor.sdaletech.com/newsroom/20190527_194304_BHQ_CQ5BMSI02BFB6BR9.1.pdf"
curl -o sustainability-reports/sr2017.pdf "https://investor.sdaletech.com/newsroom/20181003_182334_BHQ_LMCFVFUM4X51QQLU.1.pdf"

# Download financial statement
curl -o financials/fy2020-statement.pdf "https://investor.sdaletech.com/newsroom/20210226_185425_BHQ_MH5I9ENKZA968VFA.1.pdf"

echo "Download complete!"
```

Save this script as `download-investor-files.sh` and run:
```bash
chmod +x download-investor-files.sh
./download-investor-files.sh
```

## Total Size

Approximately **80-90 MB** for all PDFs and images (without flipbooks).

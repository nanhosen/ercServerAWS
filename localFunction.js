const functionToRun = require('./index').handler
const allStnObj = {
gbcc : [101044,101108,101402,101224,101223,101109,101220,101312,101803,101315,101311,101310,101303,101805,101314,103211,102601,103210,103208,102709,103207,101708,101222,102712,101710,102802,101809,102903,101812,104104,103209,102711,103205,102907,103403,104103,104105,104004,103903,104203,103703,104006,103902,103904,102004,102301,481307,480707,480709,481302,481306,480708,100708,43702,260117,42802,43707,261204,40724,41302,260108,260114,260701,260504,260207,260208,260204,260203,260112,260202,260206,260503,260501,260603,260601,260810,261404,260310,260505,260315,260309,260305,260306,260314,260308,261406,260805,260807,260804,261604,261603,261608,261408,261702,261708,261705,420914,420911,420901,420908,420915,420403,421103,420706,420912,421101,421806,421502,421501,421807,421905,422610,422611,421415,421406,421416,421305,421407,421304,421301,421602,422102,421702,421405,422002,422711,422712,422710,422203,422803,422502,422606,422503,422608,422604,422807,422609,20223,,20109,20108,20107,422806,20114,422805],
alaska : [500102,500104,500206,500214,500215,500217,500220,500309,500317,500317,500319,500321,500322,500405,500405,500412,500414,500416,500417,500418,500420,500421,500423,500424,500425,500426,500505,500505,500615,500618,500618,500618,500618,500620,500620,500621,500621,500623,500625,500625,500626,500710,500715,500720,500721,500723,500724,500725,500726,500728,500730,500731,500733,500734,500735,500735,500735,500736,500740,500741,500742,500743,500744,500745,500746,500747,500747,500748,500749,500759,500810,500811,500902,500908,500924,500934,500936,500939,500939,500942,500945,500949,500956,500956,500957,500963,500964,500965,500966,501013,501013,501013,501026,501026,501044,501044],
nwcc : [350215,350216,350604,350718,350726,350913,350917,351502,351518,351520,351710,352024,352107,352109,352327,352329,352416,352418,352545,352550,352552,352554,352558,352605,352620,352701,352816,352915,352919,352920,353120,353227,353228,353230,353343,353344,353402,353423,353512,353524,353526,353612,353614,450117,450130,450211,450306,450911,451105,451209,451415,451509,451611,451613,451718,451921,452029,452030,452036,452040,452134,452206,452306,452404,452510,452513,452601,452916,453201,453412,453601,453803],
oncc : [40102,40105,40203,40217,40218,40221,40222,40228,40231,40233,40239,40243,40244,40306,40308,40309,40312,40408,40421,40425,40427,40428,40503,40516,40519,40609,40611,40614,40615,40630,40709,40714,40719,40723,40728,40730,40802,40812,40814,40816,40910,40916,41001,41005,41015,41201,41211,41213,41310,41406,41410,41411,41503,41701,41806,41907,41908,42202,42601,42603,43008,43009,43304,43402,43404,43502,43802,43809,260111],
eacc : [127901, 210301,212201,210405,210901,210801,211604,210203,211502,210507,212601,215601,214001,214201,136101,132207,213501,210514,214201,213301,213102,211702,210602,210709,211803,210512,210503,210509,471101,200103,470202,470207,470302,471002,470703,471601,471901,472801,471801,470804,476001,475701,215601,474301,473901,475601,214201,473501,201202,201103,200703,201002,471301,201504,203802,202902,202010,203101,203601,120201,112001,203802,232401,231501,136101,231301,132207,135501,475701,112001,476001,120201,120201,112001,235202,236902,238502,236501,239102,239004,236403,236601,119501,128905,125701,127301,125201,234801,337301,360901,336001,338401,464601,460901,460101,463001,463301,463802,336001,337301,461601,464203,465201,464901,465401,463501,462601,360991,461101,301011,361231,360331,360351,361171,360901,361002,361802,301101,300171,300411,361291,360991,301011,360131,361171,360351,360431,360271,301111,361071,300312,300491,300191,300411,300892,300311,300891,430501,430601,270301,430402,301901,270071,431301,170131,170850,270131,171603,170791,170800,305803,280372,361802,191202,305103,300712,191203,370450,280071,182201,280311,182101,180701,180201,280101,280291,280231,280191,280091,280051,182002,281501,70301,181510],
oscc : [42601,43208,43605,43613,43708,43709,43710,44106,44114,44204,44301,44302,44310,44409,44510,44516,44516,44522,44602,44707,44713,44717,44719,44722,44729,44804,44806,44904,44914,44915,44916,45101,45102,45105,45112,45113,45114,45122,45129,45129,45203,45302,45303,45313,45314,45412,45421,45426,45433,45435,45436,45438,45440,45443,45444,45604,45619,45620,45701,45707,45708,45709,45710,45731,45734,45801,45801],
nrcc : [100101,100204,100708,100711,100421,100799,100902,101014,101019,101049,101303,101310,101311,101312,101314,101315,101316,101801,101804,101805,101809,101812,101817,101890,101905,102004,102105,102106,102401,102711,102802,102903,102906,102907,103102,103205,103209,103211,103403,103703,103704,103902,103903,103904,104004,104006,104103,104104,104105,104203,240107,240110,240112,240118,240119,240120,240307,240308,240705,241102,241210,241211,241213,241302,241308,241390,241403,241404,241405,241507,241508,241513,241518,241520,241802,241901,241904,241907,241909,241910,242102,242501,242902,242904,242905,242907,242910,242911,242912,242914,242915,243002,243004,243204,243206,243302,243403,243404,243704,243902,244403,244902,245001,245002,245105,245106,245107,245108,245109,245409,245410,245412,245416,245417,245501,245506,245607,320101,320220,320401,320501,320701,321401,321703,322503,322701,322901,323536,323804,324101,324605,328501,390301,390501,390701,391051,391201,392506,392507,392602,392603,392606,392607,392608,393101,393505,393506,393507,393801,395105,395202,395601,395901,480206,480302,480501,480502,480605,480606,480709,481003,481502,481504,481801,481903,482011,482012,482102,482105,482106,482107,483101,241206,241519,100714,100901,101013,101028,101031,101045,241502,240224,240207,243303,242207,242208,480101,244603,244803,244705,242205,240902,240704,240903,240601,242403,240809,242303,240807,244002,244102,244201,245303],
swcc : [20115,20207,20209,20212,20213,20301,20303,20401,20402,20501,20509,20601,20606,21005,21007,21202,21206,45801,290101,290102,290210,290702,290801,291202,291302,291501,292001,292008,292009,292102,292103,292203,292301,292301,292702,292903,293002,293003,293101,293104,417201,417401,417403,418701],
rmcc : [50104,50105,50106,50108,50207,50304,50304,50404,50404,50406,50407,50505,51402,51404,51406,51407,51408,51504,51506,51508,51510,51606,51607,51703,51804,51901,52001,52407,52409,52704,52812,52902,53002,53102,53103,53804,53805,53806,53807,53904,53904,54702,54801,55205,55305,55704,55706,55710,55805,55901,55902,56005,56202,172286,172300,172314,172328,172341,172355,172383,172396,172410,176262,177270,179280,179307,179321,179335,179348,179362,179376,179389,179403,180240,182231,184259,185265,186236,186286,186300,186328,186341,186355,186369,186383,186396,186410,193293,193307,193321,193335,193348,193362,193389,193403,200300,200314,200328,200341,200355,200369,200383,200396,200410,207307,207321,207335,207348,207362,207376,207389,207403,214268,214286,214300,214328,214341,214369,214369,214383,214383,214396,214396,218272,220293,220307,220321,220335,220348,220362,220376,220389,221269,227286,227286,227300,227300,227314,227328,227341,227355,227369,227383,227396,229268,232248,234261,234268,234293,234307,234321,234335,234362,234376,234389,241286,241300,241314,241314,241328,241341,241355,241369,241383,248293,248307,248321,248335,248348,248362,248376,248389,255286,255300,255314,255314,255328,255328,255341,255341,255355,255369,255383,262307,262321,262335,262348,262362,262376,262389,269300,269314,269328,269341,269355,269369,269383,275307,275321,275335,275348,275362,275376,275389,277280,280276,282328,282341,282355,282369,282383,289307,289335,289348,289362,289376,296328,296341,296355,296369,296383,392506,392603,393505,393506,395105,480212,480213,480214,480306,480307,480307,480403,480404,480501,480502,480804,480804,480904,480904,480906,481002,481003,481410,481411,481411,481502,481504,481801,481903,481904,481904,482010,482011,482102,482105,482106],
sacc : [10602,11606,14602,15608,19599,19606,20603,21379,21613,23367,23594,23609,24376,24598,26359,26605,27614,28367,29371,29598,30592,31609,32613,33359,36591,37352,37366,38601,39585,39610,41370,42376,44359,46594,49373,49606,50385,50584,50602,52367,53379,53384,54345,54595,59582,60384,61353,61402,61602,62375,64394,64594,65406,65586,65597,67400,67476,67574,68360,68580,69468,69483,70335,70375,70386,71416,72355,72422,72445,72461,72472,72572,72580,73405,73482,73591,73597,73597,74334,74346,74362,75422,75432,75436,75466,76393,76440,76447,76455,76475,77572,78311,78326,78379,78411,79334,79346,79404,79584,80370,80409,80444,80467,81481,81486,81545,81553,81553,82404,82425,82435,82499,82542,82566,83419,83454,83491,83511,83566,83574,83595,83595,84324,84467,84475,84487,84503,84539,84591,85368,85383,85497,86299,86311,86334,86346,86353,86360,86419,86586,87477,87492,87515,87515,87530,87532,87546,88403,88461,88468,88545,88592,89326,90334,90346,90360,90435,90443,90503,91311,91326,91364,91377,91510,91558,91575,92289,92302,92419,92473,92490,92498,92526,93397,93426,93443,93542,93594,94391,94413,95377,95408,95467,96435,96507,96550,96590,97334,97346,97360,97445,97494,98289,98302,98311,98329,99424,100372,100402,100487,100598,101454,102333,102346,102360,102441,103302,103311,103329,103388,103414,103474,103544,103557,104576,104594,104601,105366,106413,106419,106472,106523,106563,107383,107399,107406,107486,108388,108468,108499,108504,108589,109602,110336,110347,110358,110366,110377,110539,111456,111480,112383,112388,113304,113317,113329,113394,113401,113411,113422,113429,113491,113560,114436,114615,115361,115468,115552,115594,116336,116347,116358,116572,117404,117410,117421,117518,117584,117603,118394,119366,119565,120377,120383,120389,120448,120476,120595,120619,121491,121496,121507,121625,122397,122404,122410,122418,122423,122551,122561,122593,123330,123339,123350,123358,123522,123533,123604,124580,125366,125377,125454,127330,127339,127347,127358,127389,127397,127409,127538,128383,128502,128507,128578,129563,129597,130550,130570,130587,130617,130631,131358,131366,131482,132414,132495,132640,133336,133348,133371,133379,133385,133424,133526,134327,134446,134472,134515,135395,136497,136560,136584,136623,136634,137354,137363,137572,137595,138371,138379,138383,138538,138580,139331,139338,139648,140426,140554,140560,140568,140612,140636,141343,141359,141363,141469,141488,141545,142359,142435,142477,142502,142509,142523,142551,142573,142583,143556,143563,143570,143653,144590,145338,145454,145622,146371,146379,146385,146560,146573,146581,146597,147425,147483,147501,147542,147553,147629,148343,148355,148363,148550,148566,148581,148646,149514,149557,149578,150410,150495,150523,150589,150590,150602,150618,151394,152470,152550,153433,153440,154343,154355,154363,154371,154379,154385,154544,154564,154573,155644,155664,156495,156558,156580,156590,156612,156674,157420,157548,157585,157596,157601,158441,158449,158532,158629,158647,159487,159504,159516,159569,159659,160458,161430,161583,161591,162345,162355,162363,162371,162379,162391,162571,162598,162668,163412,163448,163493,164563,164599,164626,164647,164668,165522,165552,165579,165588,165605,166513,166534,167664,168565,168565,168576,168576,168586,168586,168587,168587,168598,168598,169345,169355,169363,169371,169379,169391,169401,169505,169505,169607,169607,169615,169631,169648,170495,170495,170542,170542,170595,170595,172581,172581,172588,172588,172601,172601,172656,173553,173553,173623,174532,174532,174567,174567,174612,174612,176517,176517,176587,176587,176593,176593,176654,177638,178497,178497,178560,178560,179604,179604,179625,180615,180615,181551,181551,181571,181571,181650,181659,182511,182511,182580,182580,183567,183567,184564,184564,184588,184588,185663,186620,186620,187634,187652,188525,188525,188542,188542,188642,189569,189569,189615,189615,189616,189616,189629,189629,190582,190582,190649,190655,195572,195572,195630,195630,195642,195660,197553,197553,197627,197627,197653,198638,198638,199543,199543,202649,204643,204643],
}

const gaccArray = Object.keys(allStnObj)
// console.log(functionToRun)
functionToRun({gacc:'gbcc'})
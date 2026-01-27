/**
 * 수동 API 테스트 스크립트
 *
 * 사용법:
 *   npx ts-node scripts/test-api.ts
 *
 * 환경변수:
 *   GYEONGGI_API_KEY - 경기도 GBIS API 키
 *   SEOUL_API_KEY - 서울 버스 API 키
 */
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const GYEONGGI_API_KEY = process.env.GYEONGGI_API_KEY;
const SEOUL_API_KEY = process.env.SEOUL_API_KEY;

interface TestResult {
  name: string;
  success: boolean;
  data?: unknown;
  error?: string;
}

const results: TestResult[] = [];

async function testGyeonggiSearchStations(keyword: string): Promise<void> {
  console.log(`\n[경기도] 정류소 검색: "${keyword}"`);

  if (!GYEONGGI_API_KEY) {
    console.log('  GYEONGGI_API_KEY가 설정되지 않음 - 스킵');
    results.push({
      name: 'Gyeonggi - searchStations',
      success: false,
      error: 'API key not configured',
    });
    return;
  }

  try {
    const response = await axios.get(
      'https://apis.data.go.kr/6410000/busstationservice/v2/getBusStationListv2',
      {
        params: {
          serviceKey: GYEONGGI_API_KEY,
          keyword,
          format: 'json',
        },
        timeout: 10000,
      },
    );

    const resultCode = response.data?.response?.msgHeader?.resultCode;
    const stations = response.data?.response?.msgBody?.busStationList;

    if (String(resultCode) === '0' || String(resultCode) === '4') {
      const stationList = Array.isArray(stations)
        ? stations
        : stations
          ? [stations]
          : [];
      console.log(`  성공: ${stationList.length}개 정류소 발견`);

      if (stationList.length > 0) {
        console.log('  첫 번째 정류소:');
        console.log(`    - ID: ${stationList[0].stationId}`);
        console.log(`    - 이름: ${stationList[0].stationName}`);
        console.log(`    - 좌표: (${stationList[0].y}, ${stationList[0].x})`);
      }

      results.push({
        name: 'Gyeonggi - searchStations',
        success: true,
        data: { count: stationList.length, firstStation: stationList[0] },
      });

      // 정류소가 있으면 도착정보도 테스트
      if (stationList.length > 0) {
        await testGyeonggiArrivalInfo(stationList[0].stationId);
      }
    } else {
      throw new Error(
        `API 오류: ${resultCode} - ${response.data?.response?.msgHeader?.resultMessage}`,
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  실패: ${message}`);
    results.push({
      name: 'Gyeonggi - searchStations',
      success: false,
      error: message,
    });
  }
}

async function testGyeonggiArrivalInfo(stationId: string): Promise<void> {
  console.log(`\n[경기도] 도착정보 조회: ${stationId}`);

  try {
    const response = await axios.get(
      'https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2',
      {
        params: {
          serviceKey: GYEONGGI_API_KEY,
          stationId,
          format: 'json',
        },
        timeout: 10000,
      },
    );

    const resultCode = response.data?.response?.msgHeader?.resultCode;
    const arrivals = response.data?.response?.msgBody?.busArrivalList;

    if (String(resultCode) === '0' || String(resultCode) === '4') {
      const arrivalList = Array.isArray(arrivals)
        ? arrivals
        : arrivals
          ? [arrivals]
          : [];
      console.log(`  성공: ${arrivalList.length}개 노선 도착정보`);

      if (arrivalList.length > 0) {
        const first = arrivalList[0];
        console.log('  첫 번째 노선:');
        console.log(`    - 노선: ${first.routeName} (${first.routeId})`);
        if (first.plateNo1) {
          console.log(
            `    - 1번째 버스: ${first.plateNo1}, ${first.predictTime1}분 후 도착`,
          );
        }
        if (first.plateNo2) {
          console.log(
            `    - 2번째 버스: ${first.plateNo2}, ${first.predictTime2}분 후 도착`,
          );
        }
      }

      results.push({
        name: 'Gyeonggi - getArrivalInfo',
        success: true,
        data: { count: arrivalList.length },
      });
    } else {
      throw new Error(
        `API 오류: ${resultCode} - ${response.data?.response?.msgHeader?.resultMessage}`,
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  실패: ${message}`);
    results.push({
      name: 'Gyeonggi - getArrivalInfo',
      success: false,
      error: message,
    });
  }
}

async function testSeoulSearchStations(keyword: string): Promise<void> {
  console.log(`\n[서울] 정류소 검색: "${keyword}"`);

  if (!SEOUL_API_KEY) {
    console.log('  SEOUL_API_KEY가 설정되지 않음 - 스킵');
    results.push({
      name: 'Seoul - searchStations',
      success: false,
      error: 'API key not configured',
    });
    return;
  }

  try {
    const response = await axios.get(
      'http://ws.bus.go.kr/api/rest/stationinfo/getStationByName',
      {
        params: {
          serviceKey: SEOUL_API_KEY,
          stSrch: keyword,
          resultType: 'json',
        },
        timeout: 10000,
      },
    );

    // 서울 API는 두 가지 응답 구조가 있음
    const header =
      response.data?.ServiceResult?.msgHeader || response.data?.msgHeader;
    const body =
      response.data?.ServiceResult?.msgBody || response.data?.msgBody;
    const headerCd = header?.headerCd;
    const stations = body?.itemList;

    if (headerCd === '0' || headerCd === '4') {
      const stationList = Array.isArray(stations) ? stations : [];
      console.log(`  성공: ${stationList.length}개 정류소 발견`);

      if (stationList.length > 0) {
        console.log('  첫 번째 정류소:');
        console.log(`    - ID: ${stationList[0].stId}`);
        console.log(`    - 이름: ${stationList[0].stNm}`);
        console.log(`    - 정류소번호: ${stationList[0].arsId}`);
      }

      results.push({
        name: 'Seoul - searchStations',
        success: true,
        data: { count: stationList.length, firstStation: stationList[0] },
      });

      // 정류소가 있으면 경유노선도 테스트
      if (stationList.length > 0 && stationList[0].arsId) {
        await testSeoulRoutesByStation(stationList[0].arsId);
      }
    } else {
      throw new Error(`API 오류: ${headerCd} - ${header?.headerMsg}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  실패: ${message}`);
    results.push({
      name: 'Seoul - searchStations',
      success: false,
      error: message,
    });
  }
}

async function testSeoulRoutesByStation(arsId: string): Promise<void> {
  console.log(`\n[서울] 정류소 경유노선: ${arsId}`);

  try {
    const response = await axios.get(
      'http://ws.bus.go.kr/api/rest/stationinfo/getRouteByStation',
      {
        params: {
          serviceKey: SEOUL_API_KEY,
          arsId,
          resultType: 'json',
        },
        timeout: 10000,
      },
    );

    const header =
      response.data?.ServiceResult?.msgHeader || response.data?.msgHeader;
    const body =
      response.data?.ServiceResult?.msgBody || response.data?.msgBody;
    const routes = body?.itemList;

    if (header?.headerCd === '0' || header?.headerCd === '4') {
      const routeList = Array.isArray(routes) ? routes : [];
      console.log(`  성공: ${routeList.length}개 노선 발견`);

      if (routeList.length > 0) {
        console.log('  첫 번째 노선:');
        console.log(`    - ID: ${routeList[0].busRouteId}`);
        console.log(`    - 이름: ${routeList[0].busRouteNm}`);
      }

      results.push({
        name: 'Seoul - getRoutesByStation',
        success: true,
        data: { count: routeList.length },
      });
    } else {
      throw new Error(`API 오류: ${header?.headerCd} - ${header?.headerMsg}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  실패: ${message}`);
    results.push({
      name: 'Seoul - getRoutesByStation',
      success: false,
      error: message,
    });
  }
}

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('버스 API 테스트');
  console.log('='.repeat(60));

  console.log('\n환경변수 확인:');
  console.log(
    `  GYEONGGI_API_KEY: ${GYEONGGI_API_KEY ? '설정됨' : '미설정'}`,
  );
  console.log(`  SEOUL_API_KEY: ${SEOUL_API_KEY ? '설정됨' : '미설정'}`);

  // 테스트 키워드 (명령줄 인자 또는 기본값)
  const keyword = process.argv[2] || '강남';
  console.log(`\n테스트 키워드: "${keyword}"`);

  // 경기도 API 테스트
  await testGyeonggiSearchStations(keyword);

  // 서울 API 테스트
  await testSeoulSearchStations(keyword);

  // 결과 요약
  console.log('\n' + '='.repeat(60));
  console.log('테스트 결과 요약');
  console.log('='.repeat(60));

  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  for (const result of results) {
    const status = result.success ? '✓' : '✗';
    console.log(`  ${status} ${result.name}`);
    if (!result.success && result.error) {
      console.log(`      오류: ${result.error}`);
    }
  }

  console.log(`\n총 ${results.length}개 테스트: ${passed}개 성공, ${failed}개 실패`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);

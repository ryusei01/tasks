import type { SeasonId, SeasonInfo } from './types';

const SEASONS: Record<SeasonId, SeasonInfo> = {
  spring: {
    id: 'spring',
    name: '春',
    plantName: '桜',
    visitorName: '春の口笛',
    plantId: 'season:spring:plant',
    visitorId: 'season:spring:visitor',
    plantHue: '#f2b6c6',
  },
  summer: {
    id: 'summer',
    name: '夏',
    plantName: '向日葵',
    visitorName: '夏の迷子蛍',
    plantId: 'season:summer:plant',
    visitorId: 'season:summer:visitor',
    plantHue: '#f0c84a',
  },
  autumn: {
    id: 'autumn',
    name: '秋',
    plantName: '紅葉',
    visitorName: '秋のドングリ泥棒',
    plantId: 'season:autumn:plant',
    visitorId: 'season:autumn:visitor',
    plantHue: '#d4653a',
  },
  winter: {
    id: 'winter',
    name: '冬',
    plantName: '椿',
    visitorName: '冬のもぐりウサギ',
    plantId: 'season:winter:plant',
    visitorId: 'season:winter:visitor',
    plantHue: '#c4475a',
  },
};

export function seasonOf(now: number): SeasonInfo {
  const month = new Date(now).getMonth() + 1;
  if (month >= 3 && month <= 5) return SEASONS.spring;
  if (month >= 6 && month <= 8) return SEASONS.summer;
  if (month >= 9 && month <= 11) return SEASONS.autumn;
  return SEASONS.winter;
}

export function allSeasons(): SeasonInfo[] {
  return [SEASONS.spring, SEASONS.summer, SEASONS.autumn, SEASONS.winter];
}

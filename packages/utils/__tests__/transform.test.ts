import { EventTypes, BreadcrumbTypes, BreadcrumbLevel } from '@webguard/common';
import { eventTypeToBreadcrumbType, breadcrumbTypeToBreadcrumbLevel } from '../src';

describe('transform', () => {
  describe('eventTypeToBreadcrumbType', () => {
    it('should convert EventTypes.ERROR to BreadcrumbTypes.CODE_ERROR', () => {
      expect(eventTypeToBreadcrumbType(EventTypes.ERROR)).toBe(BreadcrumbTypes.CODE_ERROR);
    });

    it('should convert EventTypes.UNHANDLEDREJECTION to BreadcrumbTypes.CODE_ERROR', () => {
      expect(eventTypeToBreadcrumbType(EventTypes.UNHANDLEDREJECTION)).toBe(
        BreadcrumbTypes.CODE_ERROR
      );
    });

    it('should convert EventTypes.CLICK to BreadcrumbTypes.CLICK', () => {
      expect(eventTypeToBreadcrumbType(EventTypes.CLICK)).toBe(BreadcrumbTypes.CLICK);
    });

    it('should convert EventTypes.KEYUP to BreadcrumbTypes.KEYBOARD', () => {
      expect(eventTypeToBreadcrumbType(EventTypes.KEYUP)).toBe(BreadcrumbTypes.KEYBOARD);
    });

    it('should convert EventTypes.KEYDOWN to BreadcrumbTypes.KEYBOARD', () => {
      expect(eventTypeToBreadcrumbType(EventTypes.KEYDOWN)).toBe(BreadcrumbTypes.KEYBOARD);
    });
  });

  describe('breadcrumbTypeToBreadcrumbLevel', () => {
    it('should convert HTTP to INFO', () => {
      expect(breadcrumbTypeToBreadcrumbLevel(BreadcrumbTypes.HTTP)).toBe(BreadcrumbLevel.INFO);
    });

    it('should convert CLICK to INFO', () => {
      expect(breadcrumbTypeToBreadcrumbLevel(BreadcrumbTypes.CLICK)).toBe(BreadcrumbLevel.INFO);
    });

    it('should convert ROUTE to INFO', () => {
      expect(breadcrumbTypeToBreadcrumbLevel(BreadcrumbTypes.ROUTE)).toBe(BreadcrumbLevel.INFO);
    });

    it('should convert CONSOLE to DEBUG', () => {
      expect(breadcrumbTypeToBreadcrumbLevel(BreadcrumbTypes.CONSOLE)).toBe(BreadcrumbLevel.DEBUG);
    });

    it('should convert CODE_ERROR to ERROR', () => {
      expect(breadcrumbTypeToBreadcrumbLevel(BreadcrumbTypes.CODE_ERROR)).toBe(
        BreadcrumbLevel.ERROR
      );
    });

    it('should convert KEYBOARD to INFO', () => {
      expect(breadcrumbTypeToBreadcrumbLevel(BreadcrumbTypes.KEYBOARD)).toBe(BreadcrumbLevel.INFO);
    });

    it('should convert CUSTOM to INFO', () => {
      expect(breadcrumbTypeToBreadcrumbLevel(BreadcrumbTypes.CUSTOM)).toBe(BreadcrumbLevel.INFO);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoCrudComponent } from './botao-crud.component';

describe('BotaoCrudComponent', () => {
  let component: BotaoCrudComponent;
  let fixture: ComponentFixture<BotaoCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotaoCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

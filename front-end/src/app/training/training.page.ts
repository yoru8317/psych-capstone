import { Component } from '@angular/core';
import { timer, interval } from 'rxjs';
import { AlertController, ModalController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { takeUntil } from 'rxjs/operators';
import { createAnimation } from '@ionic/core';
import { GetProgressService } from '../service/get-progress.service';
import { SubmitScoresService } from '../service/submit-scores.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

enum Race { BLACK, ASIAN }
enum Stage { START, TRAINING, ASSESSMENT, DONE }
enum Task { NAME_FACE, WHOS_NEW, MEMORY, SHUFFLE, FORCED_CHOICE, SAME_DIFFERENT, PRETEST, POSTTEST, LEARNING }

let raceProperties = {
  0: {
    race: Race.BLACK,
    namePool: {
      1: ['James', 'John', 'Robert', 'Michael', 'Will', 'David', 'Richard', 'Joseph'],
      2: ['Thomas', 'Charlie', 'Chris', 'Daniel', 'Matthew', 'Anthony', 'Don', 'Mark'],
      3: ['Paul', 'Steven', 'Andrew', 'Ken', 'Joshua', 'George', 'Kevin', 'Brian'],
      4: ['Edward', 'Ron', 'Tim', 'Jason', 'Jeff', 'Ryan', 'Jacob', 'Gary'],
      5: ['Nick', 'Eric', 'Stephen', 'Jonathan', 'Larry', 'Justin', 'Scott', 'Brandon'],
      6: ['Frank', 'Ben', 'Greg', 'Sam', 'Ray', 'Patrick', 'Alex', 'Jack'],
      7: ['Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Henry', 'Doug', 'Adam'],
      8: ['Peter', 'Nathan', 'Zach', 'Walter', 'Kyle', 'Harry', 'Carl', 'Jeremy']
    },
    facePath: 'assets/sample-faces/black/'
  }
}

@Component({
  selector: 'app-training',
  templateUrl: 'training.page.html',
  styleUrls: ['training.page.scss']
})
export class TrainingPage {

  constructor(public alertController: AlertController, public modalController: ModalController, private routerOutlet: IonRouterOutlet, public getProgress: GetProgressService, public submitScores: SubmitScoresService, public toastController : ToastController, public localNotifications : LocalNotifications) {

    this.routerOutlet.swipeGesture = false;

  }

  ionViewWillEnter() {
    this.currentRace = Race.BLACK;
    this.initCurrentLevel();
  }

  ionViewWillLeave() {
    Array.from(document.getElementsByClassName('fade-in') as HTMLCollectionOf<HTMLElement>)[0].style.opacity = '0';
  }

  ngAfterViewInit() {
    if (this.userLevel == 0) {
      timer(500).subscribe(() => {
        this.getHelp(true);
      });
    }
  }

  Race = Race;
  Stage = Stage;
  Task = Task;
  stage : Stage = null;
  task : Task = null;
  learningDone : boolean = false;
  scores : number[] = [-1, -1, -1, -1, -1, -1];

  minTrainScore : number = 0.75;
  taskLengths : number[] = [8, 8, 32, 16, 8, 8];
  numFaces : number = 8;
  assessmentPoolSize : number = 30;
  assessment_icon : string = "assets/icon/assessment.svg";
  replay_icon : string = "assets/icon/replay.svg";
  face_icon : string = "assets/icon/face.svg";

  setNames : string[];
  trainingFacePaths : string[];
  whosNewFacePaths : string[];
  assessmentFacePaths : string[];
  progress : number;
  currentRace : any;
  userLevel : any;

  initCurrentLevel(race : Race = Race.BLACK) {

    this.currentRace = race;

    this.getProgress.getData().subscribe((res) => {

      let days = res['days'];
      this.userLevel = res['level'];
      let levelCompletedToday = false;
      this.stage = Stage.START;

      if (this.userLevel == 0 || this.userLevel == 9) {

        this.assessmentFacePaths = this.getAssessmentFaces(false);

        let images : any[] = [];
        for (let i = 0; i < this.assessmentFacePaths.length; i++) {
          images.push(new Image());
          images[i].src = this.assessmentFacePaths[i];
        }

      } else if (this.userLevel > 0 && this.userLevel < 9) {

        let today = new Date().toLocaleDateString();
        let lastDay = '';
        for (let day in days) {
          if ([days[day]['nameface'], days[day]['whosnew'], days[day]['memory'], days[day]['shuffle'], days[day]['forcedchoice'], days[day]['samedifferent']].indexOf(-1) < 0) {
            lastDay = new Date(days[day]['date']).toLocaleDateString();
          }
        }
        if (today == lastDay) {
          levelCompletedToday = true;
        }

        if (!levelCompletedToday) {

          this.setNames = raceProperties[this.currentRace].namePool[this.userLevel];
          this.trainingFacePaths = this.getTrainingFaces();
          this.whosNewFacePaths = this.getWhosNewFaces();
          this.assessmentFacePaths = this.getAssessmentFaces(true);

          // Preload images
          let images : any[] = [];
          for (let i = 0; i < this.trainingFacePaths.length; i++) {
            images.push(new Image());
            images[i].src = this.trainingFacePaths[i];
          }
          for (let i = 0; i < this.whosNewFacePaths.length; i++) {
            images.push(new Image());
            images[i].src = this.whosNewFacePaths[i];
          }
          for (let i = 0; i < this.assessmentFacePaths.length; i++) {
            images.push(new Image());
            images[i].src = this.assessmentFacePaths[i];
          }

          if (days[this.userLevel - 1]) {
            this.scores = [days[this.userLevel - 1]['nameface'], days[this.userLevel - 1]['whosnew'], days[this.userLevel - 1]['memory'], days[this.userLevel - 1]['shuffle'], days[this.userLevel - 1]['forcedchoice'], days[this.userLevel - 1]['samedifferent']];
            this.learningDone = this.scores.indexOf(-1) > -1;
          }

          this.iterateStage();

        } else {
          this.userLevel--;
          this.finishLevel();
        }

      } else {
        this.stage = Stage.DONE;
      }

      let images : any[] = [];
      images.push(new Image());
      images[images.length - 1].src = 'assets/background_imgs/mask1.png';

    }, async (err) => { 
      const toast = await this.toastController.create({
        message: 'Something went wrong. Please try logging out and back in',
        color: 'danger',
        duration: 2000
      });
      toast.present();
    });

  }

  iterateStage() {
    this.task = null;
    if (!this.learningDone) {
      this.stage = Stage.START;
    } else if (this.trainingNotDone()) {
      this.stage = Stage.TRAINING;
      if (this.scores[Task.NAME_FACE] == -1 && this.scores[Task.WHOS_NEW] == -1 && this.scores[Task.MEMORY] == -1 && this.scores[Task.SAME_DIFFERENT] == -1) {
        this.renderLevelOneHelp();
      }
    } else if (this.scores.includes(-1)) {
      this.stage = Stage.ASSESSMENT;
      if (this.scores[Task.FORCED_CHOICE] == -1 && this.scores[Task.SAME_DIFFERENT] == -1) {
        this.renderLevelOneHelp();
      }
    } else {
      this.finishLevel();
      this.scheduleNotification();
    }
  }

  getTitle() {
    switch (this.task) {
      case null:
        switch (this.stage) {
          case Stage.START:
            return 'Start';
          case Stage.TRAINING:
            return 'Training Tasks';
          case Stage.ASSESSMENT:
            return 'Assessment Tasks';
          case Stage.DONE:
            return 'Finish';
          default:
            return "Modules";
        }
      case Task.LEARNING:
        return 'Meet Today\'s Faces';
      case Task.NAME_FACE:
        return 'Name and Face';
      case Task.WHOS_NEW:
        return 'Who\'s New?';
      case Task.MEMORY:
        return 'Memory Match';
      case Task.SHUFFLE:
        return 'Shuffle';
      case Task.FORCED_CHOICE:
        return 'Forced Choice';
      case Task.SAME_DIFFERENT:
        return 'Same-Different';
      case Task.PRETEST:
        return 'Pre-Assessment';
      case Task.POSTTEST:
        return 'Post-Assessment';
      default:
        return "Modules"
    }
  }

  async getHelp(displayFirst : boolean) {
    const modal = await this.modalController.create({
      component: HelpModalComponent,
      componentProps: {
        "paramTask": this.getTitle(),
        "displayFirst": displayFirst
      }
    });
    await modal.present();
  }

  renderLevelOneHelp() {
    if (this.userLevel == 1) {
      timer(500).subscribe(() => {
        this.getHelp(true);
      });
    }
  }

  getTrainingFaces() {
    let facePaths : string[] = [];
    for (let i = 0; i < this.numFaces; i++) {
      facePaths.push(raceProperties[this.currentRace].facePath + "training/level-" + this.userLevel + "/" + i + ".png");
    }
    return facePaths;
  }

  getWhosNewFaces() {
    let facePaths : string[] = [];
    let afterFaces = this.numFaces - this.userLevel + (1 - Math.round(this.userLevel/this.numFaces));
    let beforeFaces = this.numFaces - afterFaces;
    for (let i = 0; i < afterFaces; i++) {
      facePaths.push(raceProperties[this.currentRace].facePath + "training/level-" + (this.userLevel + 1) + "/" + i + ".png");
    }
    for (let i = 0; i < beforeFaces; i++) {
      facePaths.push(raceProperties[this.currentRace].facePath + "training/level-" + (this.userLevel - 1) + "/" + i + ".png");
    }
    return facePaths;
  }
  
  getAssessmentFaces(daily : boolean) {
    let facePaths : string[] = [];
    let faceNums : number[] = [];

    let faceNumber : number = daily ? this.numFaces : this.assessmentPoolSize;

    for (let i = 0; i < faceNumber; i++) {
      let face = Math.floor(Math.random() * this.assessmentPoolSize);
      while (faceNums.indexOf(face) > -1) { // Account for repeats
        face = Math.floor(Math.random() * this.assessmentPoolSize);
      }
      faceNums.push(face);
    }
    for (let face of faceNums) {
      if (daily) {
        facePaths.push(raceProperties[this.currentRace].facePath + "daily-assessment/" + face + ".jpg");
      } else {
        facePaths.push(raceProperties[this.currentRace].facePath + "pre-post-assessment/" + face + ".jpg");
      }
    }
    return facePaths;
  }

  finished(score : number[], task : number) {
    this.scores[task] = Math.max(score[0], this.scores[task]);
    if (score[1] != 0) { // Not retrying
      if (score[1] == 1) { // Learning
        this.task = Task.LEARNING;
      } else { // Done
        this.task = null;
      }
      if (task == 4 || task == 5) { // Assessments automatically move on
        this.iterateStage();
      }
    }
    this.submitScores.submitTaskScores(this.userLevel, this.scores);
  }

  finishPrePost(score : number[]) {
    if (this.userLevel == 0) {
      this.submitScores.submitPreAssessment(score[0]);
    } else if (this.userLevel == 9) {
      this.submitScores.submitPostAssessment(score[0]);
    }
    this.finishLevel();
  }

  async taskExitAlert() {
    const alert = await this.alertController.create({
      header: 'Quit',
      message: 'Do you want to quit? Your progress on this task will be lost.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Quit',
          handler: () => {
            timer(500).subscribe(() => {
              this.task = null;
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async startAssessmentAlert() {
    const alert = await this.alertController.create({
      header: 'Assessment',
      message: 'Do you want to move on to the assessment? You will not be able to come back to training today.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Go',
          handler: () => {
            timer(500).subscribe(() => {
              this.iterateStage();
            })
          }
        }
      ]
    });

    await alert.present();
  }

  clickStart() {
    if (this.userLevel == 0) {
      this.task = Task.PRETEST;
      timer(500).subscribe(() => {
        this.getHelp(true);
      });
    } else if (this.userLevel == 9) {
      this.task = Task.POSTTEST;
    } else if (this.userLevel > 0 && this.userLevel < 9) {
      this.task = Task.LEARNING;
      this.renderLevelOneHelp();
    }
  }

  finishLevel() {

    this.stage = Stage.DONE;

    let currentTask : Task = this.task;
    this.task = null;

    if (currentTask != Task.POSTTEST) {
      this.progress = 0;
      timer(1200).subscribe(async () => {
        this.userLevel++;

        let inflate = createAnimation()
        .addElement(document.querySelector('.level'))
        .fill('none')
        .duration(500)
        .keyframes([
          { offset: 0, transform: 'scale(1, 1)' },
          { offset: 0.5, transform: 'scale(2, 2)' },
          { offset: 1, transform: 'scale(1, 1)' }
        ]);
        await inflate.play();

        timer(500).subscribe(async () => {
          let fadeIn = createAnimation()
          .addElement(document.querySelector('.fade-in'))
          .fill('none')
          .duration(500)
          .fromTo('opacity', '0', '1');
          await fadeIn.play();
          Array.from(document.getElementsByClassName('fade-in') as HTMLCollectionOf<HTMLElement>)[0].style.opacity = '1';
        });

      });

      interval(100)
      .pipe(
        takeUntil(timer(1100))
      )
      .subscribe(() => {
        this.progress += .1;
      });

    } else {
      this.userLevel++;
    }
  }

  trainingNotDone() {
    return this.scores[Task.NAME_FACE] < this.taskLengths[Task.NAME_FACE] * this.minTrainScore ||
      this.scores[Task.WHOS_NEW] < this.taskLengths[Task.WHOS_NEW] * this.minTrainScore  ||
      this.scores[Task.MEMORY] < this.taskLengths[Task.MEMORY] * this.minTrainScore  ||
      this.scores[Task.SHUFFLE] < this.taskLengths[Task.SHUFFLE] * this.minTrainScore
  }

  scheduleNotification() {
    let date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    date.setHours(8);
    date.setDate(date.getDate() + 1);
    this.localNotifications.schedule({
      id: 1,
      text: 'You\'re next training is now available!',
      foreground: true,
      trigger: {at: date}
    });
  }
}
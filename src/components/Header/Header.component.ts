import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Header extends Vue {
  @Prop() private position!: string;

  activeIndex: string = '1';
  activeIndex2: string = '1';

  handleSelect(key: any, keyPath: any) {
    console.log(key, keyPath);
  }
}

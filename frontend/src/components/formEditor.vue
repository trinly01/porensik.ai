<template>
  <div class="col">
    <div class="row q-pb-md">
      <q-input class="col" v-model="value.label" label="Title" />
      <div>
        <div class="col q-pt-md q-pl-md justify-center" style="position: relative; top: 0px;">
          <div class="row justify-center q-pb-sm">
            <div>User Response</div>
          </div>
          <div>
            <q-toggle
              class="q-pl-md"
              v-model="value.editableResponse"
              label="Editable"
              left-label
              color="purple"
            />
          </div>
          <q-toggle
            class="q-pl-md"
            v-model="value.multipleResponse"
            label="Multiple"
            left-label
            color="purple"
          />
        </div>
      </div>
    </div>
    <q-editor v-model="value.details" min-height="5rem" :toolbar="toolbar" :fonts="fonts" />
    <draggable
    v-model="value.format"
    class="col q-pt-md q-gutter-md q-pb-md"
    handle=".drag_handle"
    ghost-class="ghost"
    @change="(change) => {selected = change.moved.newIndex}">
      <q-card :class="{
        'no-shadow': i !== selected,
        ghost: true
      }"
      v-for="(elem, i) in value.format" :key="'elem' + i" :ref="'elem' + i"
      @mouseover="hover = i"
      @mouseout="hover = null"
      @click="selected = i">
        <div class="row justify-center" style="height: 12px;">
          <q-icon style="cursor: move;" size="18px" class="drag_handle" v-show="selected === i || hover === i" name="drag_handle" color="grey"></q-icon>
        </div>
        <q-card-section class="row">
          <div class="col q-mr-sm">
            <q-input v-model="elem.field" placeholder="Question" />
          </div>
          <div class="col" v-if="selected === i">
            <q-input v-model="elem.description" placeholder="Description" />
          </div>
          <div class="col-3 q-pl-md">
            <div class="col">
              {{ elem.type ? '' : (elem.type = {
                  label: 'Text',
                  value: 'Text',
                  icon: 'text_format'
                }) }}
              <q-select
                :filled="selected === i"
                v-model="elem.type"
                :options="typeOptions"
              >
                <template v-slot:prepend>
                  <q-icon :name="elem.type.icon || 'text_format'" />
                </template>
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section avatar>
                      <q-icon :name="scope.opt.icon" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="row" v-if="elem.type.value && elem.type.value === 'Select' && selected === i">
          <div class="col">
            <div class="row q-gutter-sm items-center" v-for="(op, opi) in elem.options" :key="i + '-' + opi" @mouseleave="opthover = null" @mouseover="opthover = i + '-' + opi">
              <q-icon v-if="elem.isMultiple === false" name="radio_button_checked" color="blue-grey-13" size="16px" />
              <q-icon v-else name="check_box" color="blue-grey-13" size="16px" />
              <q-input v-model="op.label" :placeholder="'Label ' + (opi + 1) " />
              <q-input v-model="op.value" :placeholder="'Value ' + (opi + 1) " />
              <div class="row q-gutter-sm" v-show="opthover === i + '-' + opi">
                <q-btn v-show="elem.options.length > 2" size="sm" round color="blue-grey-13" icon="delete" @click="() => elem.options.splice(opi, 1)" ></q-btn>
                <q-btn size="sm" round color="blue-grey-13" icon="file_copy" @click="duplicateOption(elem.options, op, opi)" ></q-btn>
                <q-btn size="sm" round color="blue-grey-13" icon="add_circle" @click="addOption(elem.options, opi)" ></q-btn>
              </div>
            </div>
          </div>
          <div class="col-3 q-pl-md">
            <div class="row q-pt-md">
              <div class="col">Selection</div>
              <q-btn-toggle
                v-model="elem.isMultiple"
                toggle-color="primary"
                size="sm"
                :options="[
                  {label: 'Single', value: false},
                  {label: 'Multiple', value: true}
                ]"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="row" v-if="elem.type.value && elem.type.value === 'Rating' && selected === i">
          <div class="col">
            <div class="row q-gutter-sm items-center"></div>
          </div>
          <div class="col-3 q-pl-md">
            <div class="row q-gutter-sm items-center">
              <div class="col">Range</div>
              <div style="position: relative; top: 0px;">1 to </div>
              <q-input dense filled style="max-width: 72px;" v-model.number="elem.max" min="2" max="15" placeholder="max" type="number" />
            </div>
          </div>
        </q-card-section>
        <q-card-section v-show="selected === i" class="row items-center q-gutter-md">
          <div class="col">
            <div class="row">
              <q-toggle
                v-model="elem.isRequired"
                label="Required"
                left-label
              />
              <q-toggle
                class="q-pl-md"
                v-model="elem.isEditable"
                label="Editable"
                left-label
              />
            </div>
          </div>
          <q-btn v-if="value.format.length !== 1" flat round color="blue-grey-14" icon="delete" @click="removeQuestion(i)" ></q-btn>
          <q-btn flat round color="blue-grey-14" icon="file_copy" @click="duplicate(elem, i)" ></q-btn>
          <q-btn flat round color="blue-grey-14" icon="add_circle" @click="addQuestion(i)" ></q-btn>
        </q-card-section>
        <div v-show="selected !== i" class="q-pl-md text-caption text-grey" style="position: relative; top: -8px;">
          {{ elem.isRequired ? 'Required' : '' }}
          {{ elem.isRequired && elem.isEditable ? '|' : '' }}
          {{ elem.isEditable ? 'Editable' : '' }}
        </div>
      </q-card>
    </draggable>
  </div>
</template>

<script>

const formElem = {
  field: '',
  type: {
    label: 'Text',
    value: 'Text',
    icon: 'text_format'
  },
  value: '',
  isRequired: false,
  isMultiple: false,
  assignedTo: '',
  options: [
    {
      label: '',
      value: ''
    },
    {
      label: '',
      value: ''
    }
  ]
}

export default {
  props: [ 'value' ],
  mounted () {
    if (!this.value.format.length) {
      this.value.format = [ formElem ]
    }
  },
  watch: {
    value: {
      handler (f) {
        this.$emit('input', f)
      },
      deep: true
    }
  },
  computed: {
    hasDuplicateFields () {
      return this.getDuplicates()
    }
  },
  methods: {
    getDuplicates (a, k) {
      this.$lodash.filter(
        this.$lodash.uniq(
          this.$lodash.map(a, function (item) {
            if (this.$lodash.filter(a, { id: item[k] }).length > 1) {
              return item[k]
            }
            return false
          })
        ),
        function (value) { return value }
      )
    },
    addOption (options, i) {
      options.splice(i + 1, 0, {
        label: '',
        value: ''
      })
    },
    removeQuestion (i) {
      this.value.format.splice(i, 1)
      setTimeout(() => {
        this.selected = i - 1
      }, 0)
    },
    duplicateOption (options, op, i) {
      options.splice(i + 1, 0, this.$lodash.cloneDeep(op))
    },
    addQuestion (i) {
      let newI = i + 1
      this.value.format.splice(newI, 0, this.$lodash.cloneDeep(formElem))
      setTimeout(() => {
        this.selected = newI
      }, 0)
    },
    duplicate (elem, i) {
      let newI = i + 1
      this.value.format.splice(newI, 0, this.$lodash.cloneDeep(elem))
      setTimeout(() => {
        this.$refs['elem' + newI][0].$el.scrollIntoView({ block: 'center', behavior: 'smooth' })
        this.selected = newI
      }, 0)
    }
  },
  data () {
    return {
      form: {},
      selected: null,
      hover: null,
      opthover: null,
      // label: '',
      // details: '',
      // editableResponse: false,
      // format: [ { ...formElem } ],
      typeOptions: [
        {
          label: 'Text',
          value: 'Text',
          icon: 'text_format'
        },
        {
          label: 'Number',
          value: 'Number',
          icon: 'exposure_plus_1'
        },
        {
          label: 'Select',
          value: 'Select',
          icon: 'check_box'
        },
        {
          label: 'Rating',
          value: 'Rating',
          icon: 'linear_scale'
        },
        {
          label: 'Date',
          value: 'Date',
          icon: 'date_range'
        },
        {
          label: 'Time',
          value: 'Time',
          icon: 'access_time'
        },
        {
          label: 'digiSign',
          value: 'digiSign',
          icon: 'fas fa-signature'
        }
      ],
      toolbar: [
        ['left', 'center', 'right', 'justify'],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        [
          {
            label: this.$q.lang.editor.formatting,
            icon: this.$q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: this.$q.lang.editor.fontSize,
            icon: this.$q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: this.$q.lang.editor.defaultFont,
            icon: this.$q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['undo', 'redo'],
        ['print', 'fullscreen']
      ],
      fonts: {
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }
    }
  }
}
</script>

<template>
  <div class="content-goto card w-50">
    <div class="list-group list-group-flush list-group-hoverable">
      <NuxtLink :to="$attrs['to']" class="list-group-item text-decoration-none">
        <div class="row align-items-center">
          <!-- <div class="col-auto"><span class="badge bg-green"></span></div> -->
          <!-- <div class="col-auto">
            <span class="avatar"><Icon>Star</Icon></span>
          </div> -->
          <div class="col">
            <div class="text-reset d-block mb-1"><slot /></div>
            <div class="d-block text-secondary text-truncate">
              {{ $attrs['description'] }}
            </div>
          </div>
          <div class="col-auto">
            <Icon>ChevronRight</Icon>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style>
.content-goto {
  width: 45%;
  display: inline-block;
  cursor: pointer;
  vertical-align: middle;
  margin: 0 2.5%;
}

.content-goto .list-group-item p {
  margin: 0;
}
/* .content-goto {
  background: transparent;
  padding: 1.5rem;
  border: 1px solid #8bb1c6;
  border-radius: 4px;
  width: 45%;
  display: inline-block;
  cursor: pointer;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  text-decoration: none;
}

.content-goto:hover {
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
} */
</style>
